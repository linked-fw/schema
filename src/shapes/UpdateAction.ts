import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Action } from './Action.js';

@linkedShape({
  name: 'UpdateAction',
  description:
    'An action of updating or modifying something. Represents modification activities with agent, object, and target collection relationships. (modification, edit, change)',
})
export class UpdateAction extends Action {
  static targetClass = schema.UpdateAction;
}
