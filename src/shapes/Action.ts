import { ShapeSet } from '@_linked/core/collections/ShapeSet';
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

  /**
   * Other co-agents that took part in the action indirectly (schema.org: "Other co-agents that
   * participated in the action indirectly"), so any number of them.
   */
  @objectProperty({
    path: schema.participant,
    shape: Person,
  })
  get participant(): ShapeSet<Person> {
    return new ShapeSet<Person>();
  }

  /**
   * The object the action is carried out upon (schema.org: "The object upon which the action is
   * carried out"), a single role.
   */
  @objectProperty({
    path: schema.object,
    shape: Thing,
    maxCount: 1,
  })
  get object(): Thing {
    return null;
  }

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
