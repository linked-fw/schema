import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { linkedShape } from '../package.js';
import { Thing } from './Thing.class.js';
import { schema } from '../ontologies/schema.js';
import { AdministrativeArea } from './AdministrativeArea.class.js';

@linkedShape({
  name: 'PostalAddress',
  description:
    'A mailing address; includes street, city, postal code, and country. Used for contact info of people, places, or organizations. (address, contact, location)',
})
export class PostalAddress extends Thing {
  static targetClass = schema.Thing;

  @literalProperty({
    path: schema.postalCode,
    maxCount: 1,
  })
  get postalCode(): string {
    return '';
  }

  @objectProperty({
    path: schema.areaServed,
    shape: AdministrativeArea,
    maxCount: 1,
  })
  get areaServed(): AdministrativeArea {
    return null;
  }

  @literalProperty({
    path: schema.addressCountry,
    maxCount: 1,
  })
  get addressCountry(): string {
    return '';
  }

  @literalProperty({
    path: schema.addressRegion,
    maxCount: 1,
  })
  get addressRegion(): string {
    return '';
  }

  @literalProperty({
    path: schema.addressLocality,
    maxCount: 1,
  })
  get addressLocality(): string {
    return '';
  }

  @literalProperty({
    path: schema.streetAddress,
    maxCount: 1,
  })
  get streetAddress(): string {
    return '';
  }
}
