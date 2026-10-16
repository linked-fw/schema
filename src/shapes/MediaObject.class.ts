import { Server } from '@_linked/server-utils/utils/Server';
import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { disallowProperty, literalProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { CreativeWork } from './CreativeWork.class.js';

@linkedShape({
  name: 'MediaObject',
  description:
    'A media object such as an image, video, or audio file. Represents digital media with content URL, encoding, and file properties. (media, file, content)',
})
export class MediaObject extends CreativeWork {
  static targetClass = schema.MediaObject;

  @literalProperty({
    path: schema.contentUrl,
    maxCount: 1,
  })
  get contentUrl(): string {
    return '';
  }

  @disallowProperty
  get url(): string {
    return undefined;
  }

  @disallowProperty
  get image(): MediaObject {
    return undefined;
  }

  @disallowProperty
  get text(): string {
    return undefined;
  }

  static deleteFile(filePath: string) {
    return Server.call(this, 'deleteFile', filePath) as Promise<void>;
  }

  static fromFormFiles(files: FileList): Promise<ShapeSet<MediaObject>> {
    var formData = new FormData();
    for (var key in files) {
      if (files.hasOwnProperty(key)) {
        formData.append('upload-' + key, files[key], files[key].name);
      }
    }
    return null;

    //content-type needs to specifically be left UNDEFINED
    //https://stackoverflow.com/questions/39280438/fetch-missing-boundary-in-multipart-form-data-post
    // var headers = {
    //   Accept: 'application/json, text/plain, */*',
    // };
    //
    // return Server.call(new MediaObject(), {
    //   method:'fromFormFiles',
    //   headers
    // }, formData) as Promise<ShapeSet<MediaObject>>;

    // return Server.call(MediaObject, 'fromFormFiles', formData) as Promise<MediaObject>;
  }
}
