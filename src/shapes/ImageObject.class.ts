import { Server } from '@_linked/server-utils/utils/Server';
import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { MediaObject } from './MediaObject.class.js';

interface MediaGalleryAsset {
  data: ImageObject;
}

export interface ImageCreationMetaData {
  copyrightNotice?: string;
  creditText?: string;
  usageInfo?: string;
  identifier?: number;
  name?: string;
  url?: string;
  dateCreated?: string;
}

@linkedShape({
  name: 'ImageObject',
  description:
    'A Schema.org ImageObject; represents an image file or resource. Used for thumbnails, profile pictures, media. (photo, picture, graphic)',
})
export class ImageObject extends MediaObject {
  static targetClass = schema.ImageObject;

  static getAllFilestoreImages(): Promise<ShapeSet<MediaObject>> {
    return Server.call(this, 'getAllFilestoreImages') as Promise<
      ShapeSet<ImageObject>
    >;
  }

  static fromDataURL(
    dataURL: string,
    filePath?: string,
    metaData?: ImageCreationMetaData
  ): Promise<ImageObject> {
    return Server.call(
      this,
      'fromDataURL',
      dataURL,
      filePath,
      metaData
    ) as Promise<ImageObject>;
  }

  static readImageFromDB(brandName: string) {
    return Server.call(this, 'readImageFromDB', brandName) as Promise<
      MediaGalleryAsset[] | null
    >;
  }
  /**
   * @param file
   * @param name optionally specify a name for the file
   */
  static fromFormFile(file: File, name?: string): Promise<ImageObject> {
    var formData = new FormData();
    formData.append('upload', file, name || file.name);
    return Server.callCustomShapeMethod(
      this,
      'POST',
      'fromFormFile',
      formData,
      {
        Accept: 'application/json, text/plain, */*',
        //content-type needs to specifically be left UNDEFINED
        //https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
      }
    ) as Promise<ImageObject>;
  }
}
