import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Action } from './Action.js';

/**
 * The person who makes the connection is the action's `agent`; the person that gets connected is
 * its `object`.
 */
@linkedShape({
  name: 'BefriendAction',
  description:
    'An action of establishing a friendship relationship. Represents social connections with agent and object person relationships. (friend request, connection, social)',
})
export class BefriendAction extends Action {
  static targetClass = schema.BefriendAction;
}
