import { Server } from '@_linked/server-utils/utils/Server';
import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { MediaObject } from './MediaObject.js';

@linkedShape({
  name: 'VideoObject',
  description:
    'A video file or video stream. Represents video content with duration, encoding, and playback properties. (video, movie, clip)',
})
export class VideoObject extends MediaObject {
  static targetClass = schema.VideoObject;

  // @objectProperty({
  //   path: schema.about,
  //   shape: Thing,
  // })
  // get about(): ShapeSet<Thing> {
  //   return Thing.getSetOf(this.getAll(schema.about));
  // }

  static fromDataURL(
    dataURL: string,
    filename?: string,
    imgType?: string
  ): Promise<VideoObject> {
    return Server.call(
      this,
      'fromDataURL',
      dataURL,
      filename,
      imgType
    ) as Promise<VideoObject>;
  }

  static fromBlob(blob: Blob, filename?: string): Promise<VideoObject> {
    //https://stackoverflow.com/a/29390393/977206
    let file = new File([blob], filename, { type: blob.type });
    return this.fromFormFile(file, filename);
  }

  /**
   * @param file
   * @param name optionally specify a name for the file
   */
  static fromFormFile(
    file: File,
    filePath: string,
    metaData?: {
      copyrightNotice?: string;
      creditText?: string;
      usageInfo?: string;
      identifier?: number;
      url?: string;
      dateCreated?: string;
    }
  ): Promise<VideoObject> {
    var formData = new FormData();
    if (file) formData.append('upload', file);
    if (filePath) formData.append('filePath', filePath);
    if (metaData) {
      if (metaData.copyrightNotice) {
        formData.append('copyrightNotice', metaData.copyrightNotice);
      }
      if (metaData.creditText) {
        formData.append('creditText', metaData.creditText);
      }
      if (metaData.usageInfo) {
        formData.append('usageInfo', metaData.usageInfo);
      }
      if (metaData.identifier) {
        formData.append('identifier', metaData.identifier.toString());
      }
      if (metaData.url) {
        formData.append('url', metaData.url);
      }
      if (metaData.dateCreated) {
        formData.append('dateCreated', metaData.dateCreated);
      }
    }

    return Server.callCustomShapeMethod(
      this,
      'POST',
      'fromFormFile',
      formData,
      {
        Accept: 'application/json, text/plain, */*',
        //content-type needs to specifically be left UNDEFINED
        //https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
        // 'Content-Type': undefined,
      }
    ) as Promise<VideoObject>;
  }
}
