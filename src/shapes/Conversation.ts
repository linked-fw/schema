import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Thing } from './Thing.js';

@linkedShape({
  name: 'Conversation',
  description:
    'A conversation or discussion. Represents interactive exchanges between participants with message relationships. (discussion, chat, dialogue)',
})
export class Conversation extends Thing {
  static targetClass = schema.Conversation;
}
