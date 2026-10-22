import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { Shape } from '@_linked/core/shapes/Shape';
import { objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Intangible } from './Intangible.class.js';
import './Intangible.js';
import { ListItem } from './ListItem.js';

@linkedShape({
  name: 'ItemList',
  description:
    'A list of items of any sort. Represents ordered collections with item list elements and position relationships. (list, collection, sequence)',
})
export class ItemList<S extends Shape = Shape> extends Intangible {
  static targetClass = schema.ItemList;

  @objectProperty({
    path: schema.itemListElement,
    shape: ListItem,
  })
  get itemListElements(): ShapeSet<ListItem<S>> {
    return new ShapeSet<ListItem<S>>();
  }

  @objectProperty({
    path: [schema.itemListElement, schema.item],
    // TODO: sortBy: [schema.itemListElement, schema.position]
  })
  get items(): ShapeSet<S> {
    return new ShapeSet<S>();
  }
}
