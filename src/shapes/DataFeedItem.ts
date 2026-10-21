import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { xsd } from '@_linked/xsd/ontologies/xsd';
import { Intangible } from './Intangible.class.js';
import './Intangible.js';
import { Thing } from './Thing.js';

@linkedShape({
  name: 'DataFeedItem',
  description:
    'A single item within a data feed. Represents feed entries with creation dates, modification tracking, and item relationships. (entry, feed item, record)',
})
export class DataFeedItem extends Intangible {
  static targetClass = schema.DataFeedItem;

  @literalProperty({
    path: schema.dateCreated,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get dateCreated(): Date {
    return null;
  }

  @literalProperty({
    path: schema.dateDeleted,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get dateDeleted(): Date {
    return null;
  }

  @literalProperty({
    path: schema.dateModified,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get dateModified(): Date {
    return null;
  }

  @objectProperty({
    path: schema.item,
    shape: Thing,
  })
  get item(): Thing {
    return null;
  }
}
