import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Thing } from './Thing.class.js';

@linkedShape({
  name: 'Place',
  description:
    'Entities that have a somewhat fixed, physical extension. Represents locations with coordinates, addresses, and containment relationships. (location, venue, site)',
})
export class Place extends Thing {
  static targetClass = schema.Place;

  @literalProperty({
    path: schema.latitude,
    maxCount: 1,
  })
  get latitude(): string {
    return '';
  }

  @literalProperty({
    path: schema.longitude,
    maxCount: 1,
  })
  get longitude(): string {
    return '';
  }

  @objectProperty({
    path: schema.containedInPlace,
    shape: Place,
    maxCount: 1,
  })
  get containedInPlace(): Place {
    return null;
  }
}
