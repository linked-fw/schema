import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { AdministrativeArea } from './AdministrativeArea.class.js';
import './AdministrativeArea.js';

@linkedShape({
  name: 'Country',
  description:
    'A country is a distinct territorial body or political entity. Represents nations with geographic boundaries and administrative areas. (nation, state, territory)',
})
export class Country extends AdministrativeArea {
  static targetClass = schema.Country;
}
