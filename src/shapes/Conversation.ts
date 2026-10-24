import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { CreativeWork } from './CreativeWork.class.js';
import './CreativeWork.js';

@linkedShape({
  name: 'Conversation',
  description:
    'A conversation or discussion. Represents interactive exchanges between participants with message relationships. (discussion, chat, dialogue)',
})
export class Conversation extends CreativeWork {
  static targetClass = schema.Conversation;
}
