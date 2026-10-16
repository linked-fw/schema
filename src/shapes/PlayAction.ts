import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Action } from './Action.js';

@linkedShape({
  name: 'PlayAction',
  description:
    'An action of playing a game, sport, or other activity. Represents recreational activities with agent and object relationships. (gameplay, recreation, activity)',
})
export class PlayAction extends Action {
  /**
   * indicates that instances of this shape need to have this rdf.type
   */
  static targetClass = schema.PlayAction;
}
