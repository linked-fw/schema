import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Accommodation } from './Accommodation.js';

@linkedShape({
  name: 'Apartment',
  description:
    'An apartment or flat, a self-contained housing unit. Represents residential units with accommodation features and rental relationships. (flat, unit, residence)',
})
export class Apartment extends Accommodation {
  static targetClass = schema.Apartment;
}
