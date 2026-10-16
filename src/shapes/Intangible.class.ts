import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Thing } from './Thing.class.js';

@linkedShape({
  name: 'Intangible',
  description:
    'A utility class serving as the umbrella for intangible things. Represents abstract concepts like quantities, structured values, and definitions. (abstract, concept, value)',
})
export class Intangible extends Thing {
  static targetClass = schema.Intangible;
}
