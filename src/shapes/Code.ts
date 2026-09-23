import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { CreativeWork } from './CreativeWork.js';
import { literalProperty } from '@_linked/core/shapes/SHACL';

@linkedShape({
  description:
    'Computer programming source code. Represents code with text content, programming language, and creative work properties. (source code, program, script)',
})
export class Code extends CreativeWork {
  static targetClass = schema.Code;

  @literalProperty({
    path: schema.text,
    maxCount: 1,
  })
  get text(): string {
    return '';
  }

  static fromText(text: string) {
    return Code.create({ text });
  }
}
