import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { xsd } from '@_linked/xsd/ontologies/xsd';
import { PropertyValue } from './PropertyValue.js';
import { Thing } from './Thing.js';

@linkedShape({
  name: 'Observation',
  description:
    'An observation of a specific entity at a particular time. Represents measurements with observation dates, variable tracking, and entity relationships. (measurement, data point, record)',
})
export class Observation extends Thing {
  static targetClass = schema.Observation;

  @literalProperty({
    path: schema.observationDate,
    datatype: xsd.dateTime,
    maxCount: 1,
  })
  get observationDate(): Date {
    return null;
  }

  @objectProperty({
    shape: PropertyValue,
    path: schema.variableMeasured,
    maxCount: 1,
  })
  get variableMeasured(): PropertyValue {
    return null;
  }

  @objectProperty({
    shape: Thing,
    path: schema.observationAbout,
    maxCount: 1,
  })
  get observationAbout(): Thing {
    return null;
  }
}
