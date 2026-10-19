// import {File, default as formidable} from 'formidable';
import { LinkedFileStorage } from '@_linked/core/utils/LinkedFileStorage';
import { ShapeProvider } from '@_linked/server-utils/utils/ShapeProvider';
import { callable } from '@_linked/server-utils/utils/callable';
import { ImageCreationMetaData, ImageObject } from './ImageObject.js';
import { uploadMediaFromFormFile } from '../utils/MediaObjectUpload.js';
import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import {
  base64DecodedLength,
  getMediaUploadPolicy,
  mediaCallError,
  ownedKey,
  ownedKeyForDelete,
  requireMediaCaller,
} from '../utils/MediaUploadPolicy.js';
import {
  imageTypeForDeclaredMime,
  requireExtensionFor,
  requireMediaType,
} from '../utils/MediaTypes.js';

export class ImageObjectProvider extends ShapeProvider {
  shape: ShapeProvider['shape'] = ImageObject;

  // constructor(server) {
  //   super(server);
  //
  //   //make sure upload folder exists
  //   // if (!fs.existsSync(this.fileSystemUploadPath)) {
  //   //   fs.mkdirSync(this.fileSystemUploadPath);
  //   // }
  // }

  /**
   * Delete one of the caller's own uploads. `filePath` is the store key, or the
   * public URL a save returned. Keys outside the caller's prefix answer 404.
   */
  @callable('signed-in')
  async deleteFile(filePath: string): Promise<void> {
    const caller = requireMediaCaller(this.request);
    return LinkedFileStorage.deleteFile(ownedKeyForDelete(caller, filePath));
  }

  /** The caller's own uploads (keys under their prefix). */
  @callable('signed-in')
  async getAllFilestoreImages(): Promise<ShapeSet<ImageObject>> {
    const caller = requireMediaCaller(this.request);
    const prefix = `${caller.prefix}/`;
    const files = await LinkedFileStorage.listFiles(prefix);
    let images: ShapeSet<ImageObject> = new ShapeSet();
    files
      // a store that ignores the prefix argument must still not leak keys
      .filter((file) => typeof file === 'string' && file.startsWith(prefix))
      .forEach((file) => {
        images.add(new ImageObject({ id: file }));
      });
    return images;
  }

  /**
   * Save a base64 `data:image/...` URL as an image. The file is stored under
   * the caller's prefix: `filePath` is relative to it, and the returned
   * `contentUrl` is the URL to use. Accepts PNG, JPEG, GIF, WebP and AVIF: the
   * decoded bytes must be of the declared type, and `filePath` must end in an
   * extension of that type.
   */
  @callable('signed-in')
  async fromDataURL(
    dataUrl: string,
    filePath?: string,
    metaData?: ImageCreationMetaData
  ): Promise<ImageObject> {
    const caller = requireMediaCaller(this.request);
    const { maxImageBytes } = getMediaUploadPolicy();
    const match =
      typeof dataUrl === 'string'
        ? /^data:(image\/[A-Za-z0-9.+-]+);base64,/.exec(dataUrl)
        : null;
    if (!match) {
      throw mediaCallError(400, 'Expected a base64 data:image/... URL.');
    }
    const declared = imageTypeForDeclaredMime(match[1]);
    if (!declared) {
      throw mediaCallError(415, `Images of type ${match[1].toLowerCase()} are not accepted.`);
    }
    const data = dataUrl.slice(match[0].length);
    if (base64DecodedLength(data) > maxImageBytes) {
      throw mediaCallError(413, `The image is larger than ${maxImageBytes} bytes.`);
    }
    const key = ownedKey(caller, filePath ?? `image.${declared.extensions[0]}`);
    requireExtensionFor(key, declared);
    const buf = Buffer.from(data, 'base64');
    if (buf.length > maxImageBytes) {
      throw mediaCallError(413, `The image is larger than ${maxImageBytes} bytes.`);
    }
    const type = requireMediaType(buf, 'image', declared);
    const publicPath = await LinkedFileStorage.saveFile(key, buf, type.mime, true);
    return ImageObject.create({
      contentUrl: publicPath,
      copyrightNotice: metaData?.copyrightNotice,
      usageInfo: metaData?.usageInfo,
      creditText: metaData?.creditText,
      dateCreated:
        metaData && metaData.dateCreated ? new Date(metaData.dateCreated) : null,
      url: metaData?.url,
      identifier: metaData?.identifier?.toString(),
      name: metaData?.name,
    }) as unknown as Promise<ImageObject>;
  }

  /**
   * Custom method to upload a single file
   * See ImageObject.ts for the client-side implementation
   * This custom method receives NO arguments and will need to manually handle this.request.body for example
   *
   * The type is read from the file's bytes (PNG, JPEG, GIF, WebP or AVIF); the
   * type the client sends is ignored. The stored name must end in an extension
   * of that type.
   */
  @callable('signed-in')
  async fromFormFile(): Promise<ImageObject> {
    // const form = formidable({});
    //
    // return new Promise((resolve, reject) => {
    //   form.parse(this.request, (err, fields, files) => {
    //     if (err) {
    //       console.warn('Error parsing uploaded file:' + err.stack);
    //       return;
    //     }
    //     // console.log(files);
    //
    //     let upload = files['upload'] as File;
    //     uploadSingleFileFromFormData({
    //       file: upload,
    //       allowedExtensions: ImageObjectProvider.ALLOWED_EXTENSIONS,
    //     })
    //       .then((publicPath: string) => {
    //         let image = new ImageObject();
    //         image.contentUrl = publicPath;
    //         resolve(image);
    //       })
    //       .catch((err) => {
    //         console.warn('Error during file upload', err);
    //         resolve(null);
    //       });
    //   });
    // });
    const caller = requireMediaCaller(this.request);
    return uploadMediaFromFormFile(
      this.request,
      (data) => ImageObject.create(data) as unknown as Promise<ImageObject>,
      { caller, kind: 'image', maxBytes: getMediaUploadPolicy().maxImageBytes }
    );
  }

  // fromFormFiles(image: ImageObject, formData): Promise<ShapeSet<ImageObject>> {
  //   // console.log(formData);
  //   // console.log(formData.upload);
  //
  //   const form = formidable({});
  //   var fileNumber = 0;
  //   let uploadPromises = [];
  //
  //   return new Promise((resolve, reject) => {
  //     form.parse(this.request, (err, fields, files) => {
  //       if (err) {
  //         console.warn('Error parsing uploaded file:' + err.stack);
  //         return;
  //       }
  //       // console.log(files);
  //       while (files['upload-' + fileNumber]) {
  //         let upload = files['upload-' + fileNumber] as File;
  //         uploadPromises.push(
  //           uploadSingleFileFromFormData({
  //             file: upload,
  //             allowedExtensions: ImageObjectProvider.ALLOWED_EXTENSIONS,
  //           }),
  //         );
  //
  //         fileNumber++;
  //       }
  //
  //       Promise.all(uploadPromises)
  //         .then((paths: string[]) => {
  //           let images: ShapeSet<ImageObject> = new ShapeSet();
  //           paths.forEach((path) => {
  //             let image = new ImageObject();
  //             image.contentUrl = path;
  //             images.add(image);
  //           });
  //           resolve(images);
  //         })
  //         .catch((err) => {
  //           console.warn('Error during file upload', err);
  //           resolve(null);
  //         });
  //     });
  //   });
  // }
  //
  // // TODO: before remove, need to check where this method used. Now move to Upload on lincd-server-utils
  // private uploadSingleFileFromBuffer(
  //   buffer,
  //   fileName: string,
  // ): Promise<string> {
  //   let {targetFilePath, publicURL} = getUploadTarget(
  //     fileName,
  //     null,
  //     ImageObjectProvider.ALLOWED_EXTENSIONS,
  //   );
  //
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       await LinkedFileStorage.saveFile(targetFilePath, buffer);
  //       resolve(publicURL);
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }
}
