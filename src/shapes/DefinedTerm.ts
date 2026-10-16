import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { CreativeWork } from './CreativeWork.js';
import { Intangible } from './Intangible.js';

@linkedShape({
  name: 'DefinedTerm',
  description:
    'A word, name, acronym, phrase, etc. with a formal definition. Represents terms with definitions and relationships to term sets. (term, definition, concept)',
})
export class DefinedTerm extends Intangible {
  static targetClass = schema.DefinedTerm;

  @objectProperty({
    path: schema.inDefinedTermSet,
    shape: ['@_linked/schema', 'DefinedTermSet'],
    maxCount: 1,
  })
  get inDefinedTermSet(): any {
    return null;
  }
}

@linkedShape({
  name: 'DefinedTermSet',
  description:
    'A set of defined terms, such as a set of categories or a classification scheme. Represents collections of terms with hierarchical relationships. (vocabulary, taxonomy, scheme)',
})
export class DefinedTermSet extends CreativeWork {
  static targetClass = schema.DefinedTermSet;

  @objectProperty({
    path: schema.hasDefinedTerm,
    shape: DefinedTerm,
  })
  get definedTerms(): ShapeSet<DefinedTerm> {
    return new ShapeSet<DefinedTerm>();
  }
}
