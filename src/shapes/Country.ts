import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Place } from './Place.js';

@linkedShape({
  name: 'Country',
  description:
    'A country is a distinct territorial body or political entity. Represents nations with geographic boundaries and administrative areas. (nation, state, territory)',
})
export class Country extends Place {
  static targetClass = schema.Country;
}
