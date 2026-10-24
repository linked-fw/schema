import { objectProperty } from '@_linked/core/shapes/SHACL';
import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Action } from './Action.js';
import { Event } from './Event.js';

/**
 * The joiner is the action's `agent`; others joining with them are its `participant`s.
 */
@linkedShape({
  name: 'JoinAction',
  description:
    'An action of joining an event or group. Represents participation with agent person and event relationships. (participation, attendance, enrollment)',
})
export class JoinAction extends Action {
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
}
