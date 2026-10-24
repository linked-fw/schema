import { linkedShape } from '../package.js';
import { Place } from './Place.class.js';
import * as schema from '../ontologies/schema.js';

@linkedShape({
  name: 'AdministrativeArea',
  description:
    'A geographic or political area, e.g., country, region, city. Often linked to addresses, organizations, or events. (location, region, jurisdiction)',
})
export class AdministrativeArea extends Place {
  static targetClass = schema.AdministrativeArea;
}
