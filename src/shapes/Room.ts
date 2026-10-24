import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Accommodation } from './Accommodation.js';

@linkedShape({
  name: 'Room',
  description:
    'A room is a distinguishable space within a structure. Represents enclosed spaces with accommodation features and containment relationships. (chamber, space, area)',
})
export class Room extends Accommodation {
  static targetClass = schema.Room;
}
