import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Action } from './Action.js';

@linkedShape({
  name: 'SubscribeAction',
  description:
    'An action of subscribing to a service, publication, or channel. Represents subscription activities with agent and object relationships. (subscription, follow, signup)',
})
export class SubscribeAction extends Action {
  static targetClass = schema.SubscribeAction;
}
