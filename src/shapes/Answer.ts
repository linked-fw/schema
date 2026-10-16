import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Comment } from './Comment.js';

@linkedShape({
  name: 'Answer',
  description:
    'An answer offered to a question. Represents responses with parent-child comment relationships and question context. (response, reply, solution)',
})
export class Answer extends Comment {
  static targetClass = schema.Answer;
}
