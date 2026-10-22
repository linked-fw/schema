import { literalProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Intangible } from './Intangible.class.js';
import './Intangible.js';

@linkedShape({
  name: 'PropertyValue',
  description:
    'A property-value pair representing structured data. Represents key-value pairs with property ID and value relationships. (pair, attribute, data)',
})
export class PropertyValue extends Intangible {
  static targetClass = schema.PropertyValue;

  @literalProperty({
    path: schema.value,
    maxCount: 1,
  })
  get value(): string {
    return '';
  }

  @literalProperty({
    path: schema.propertyID,
    maxCount: 1,
  })
  get propertyID(): string {
    return '';
  }
}
