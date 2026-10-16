import { xsd } from '@_linked/xsd/ontologies/xsd';
import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import * as actionConstants from '../constants.js';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Person } from './Person.js';
import { Place } from './Place.js';
import { Thing } from './Thing.js';

@linkedShape({
  name: 'Action',
  description:
    'An action performed by a person or organization. Represents activities with agent, participant, location, and timing. (activity, operation, task)',
})
export class Action extends Thing {
  static targetClass = schema.Action;
  static readonly STATUS_ACTIVE = actionConstants.STATUS_ACTIVE;
  static readonly STATUS_COMPLETED = actionConstants.STATUS_COMPLETED;
  static readonly STATUS_POTENTIAL = actionConstants.STATUS_POTENTIAL;
  static readonly STATUS_FAILED = actionConstants.STATUS_FAILED;

  /**
   * The status of an Action (enums).
   */
  @literalProperty({
    path: schema.actionStatus,
    maxCount: 1,
    datatype: xsd.integer,
  })
  get actionStatus(): number {
    return 0;
  }

  @objectProperty({
    path: schema.agent,
    shape: Person,
    minCount: 1,
    maxCount: 1,
    description: 'The agent (person/organization) who performed the action',
  })
  get agent(): Person {
    return null;
  }

  @objectProperty({
    path: schema.participant,
    shape: Person,
    maxCount: 1,
  })
  get participant(): Person {
    return null;
  }

  @objectProperty({
    path: schema.object,
    shape: Thing,
  })
  get objects() {
    return null;
  }

  // @objectProperty({
  //   path: schema.object,
  //   shape: Thing,
  //   maxCount:1
  // })
  // get firstObject(): Thing {
  //   return this.objects.first();
  // }

  // set objects(objects: ShapeSet<Thing>) {
  //   objects.updateEach(schema.object, this.namedNode);
  // }

  // get object(): Thing {
  //   if (this.hasProperty(schema.object)) {
  //     return this.getOneAs(schema.object, Thing, true);
  //   } else {
  //     return null;
  //   }
  // }
  // set object(val: Thing) {
  //   this.overwrite(schema.object, val ? val.node : null);
  // }

  @objectProperty({
    path: schema.location,
    shape: Place,
    maxCount: 1,
  })
  get location() {
    return null;
  }

  @literalProperty({
    path: schema.startTime,
    required: false,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get startTime(): Date {
    return null;
  }

  @literalProperty({
    path: schema.endTime,
    required: false,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get endTime(): Date {
    return null;
  }
}
