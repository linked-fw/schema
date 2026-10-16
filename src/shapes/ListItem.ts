import { Shape } from '@_linked/core/shapes/Shape';
import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { xsd } from '@_linked/xsd/ontologies/xsd';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';

@linkedShape({
  name: 'ListItem',
  description:
    'An item in a list or data feed. Represents list elements with position and item relationships. (element, entry, member)',
})
export class ListItem<S extends Shape = Shape> extends Shape {
  static targetClass = schema.ListItem;

  @literalProperty({
    path: schema.position,
    maxCount: 1,
    datatype: xsd.integer,
  })
  get position(): number {
    return 0;
  }

  @objectProperty({
    path: schema.item,
    maxCount: 1,
  })
  get item(): S {
    return null;
  }
}
