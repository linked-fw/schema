import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { Shape } from '@_linked/core/shapes/Shape';
import { objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Event } from './Event.js';
import { Person } from './Person.js';

@linkedShape({
  name: 'JoinAction',
  description:
    'An action of joining an event or group. Represents participation with agent person and event relationships. (participation, attendance, enrollment)',
})
export class JoinAction extends Shape {
  static targetClass = schema.JoinAction;

  //the event joined
  @objectProperty({
    path: schema.event,
    shape: Event,
    maxCount: 1,
  })
  get event(): Event {
    return null;
  }

  //who joined the event
  @objectProperty({
    path: schema.agent,
    shape: Person,
  })
  get agents(): ShapeSet<Person> {
    return new ShapeSet<Person>();
  }
}
