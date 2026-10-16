import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Thing } from './Thing.js';

@linkedShape({
  name: 'Comment',
  description:
    'A comment on an item. Represents user feedback with parent-child relationships and threaded discussions. (feedback, remark, note)',
})
export class Comment extends Thing {
  static targetClass = schema.Comment;

  @objectProperty({
    path: schema.parentItem,
    shape: ['@_linked/schema', 'Comment'],
    maxCount: 1,
  })
  get parentItem(): Comment {
    return null;
  }

  @objectProperty({
    path: schema.childItem,
    shape: ['@_linked/schema', 'Comment'],
    maxCount: 1,
  })
  get childItem(): Comment {
    return null;
  }

  @objectProperty({
    path: schema.childItem,
    shape: ['@_linked/schema', 'Comment'],
  })
  get childItems(): ShapeSet<Comment> {
    return new ShapeSet<Comment>();
  }
}
