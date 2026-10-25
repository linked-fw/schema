import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { CreativeWork } from './CreativeWork.js';

/**
 * schema.org declares `schema:Dataset owl:equivalentClass dcat:Dataset`, so a
 * package whose own dataset class is `rdfs:subClassOf schema:Dataset` extends
 * this shape and stays a single-inheritance subclass.
 */
@linkedShape({
  name: 'Dataset',
  description:
    'A body of structured information describing some topic(s) of interest. Represents a dataset as a creative work. (dataset, data, collection)',
})
export class Dataset extends CreativeWork {
  static targetClass = schema.Dataset;
}
