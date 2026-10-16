import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Accommodation } from './Accommodation.js';

@linkedShape({
  name: 'House',
  description:
    'A house is a building or structure that serves as living quarters. Represents residential buildings with accommodation features and ownership relationships. (home, dwelling, residence)',
})
export class House extends Accommodation {
  static targetClass = schema.House;
}
