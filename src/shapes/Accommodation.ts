import { literalProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Place } from './Place.js';

@linkedShape({
  name: 'Accommodation',
  description:
    'A place to sleep or stay, such as a hotel, motel, or hostel. Represents lodging with accommodation categories and booking relationships. (lodging, hotel, stay)',
})
export class Accommodation extends Place {
  static targetClass = schema.Accommodation;

  @literalProperty({
    path: schema.accommodationCategory,
    maxCount: 1,
  })
  get accommodationCategory(): string {
    return '';
  }
}
