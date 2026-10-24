import { objectProperty } from '@_linked/core/shapes/SHACL';
import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { CreativeWork } from './CreativeWork.class.js';
import './CreativeWork.js';

@linkedShape({
  name: 'Comment',
  description:
    'A comment on an item. Represents user feedback with parent relationships for threaded discussions. (feedback, remark, note)',
})
export class Comment extends CreativeWork {
  static targetClass = schema.Comment;

  @objectProperty({
    path: schema.parentItem,
    shape: ['@_linked/schema', 'Comment'],
    maxCount: 1,
  })
  get parentItem(): Comment {
    return null;
  }
}
