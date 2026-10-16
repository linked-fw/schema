import { xsd } from '@_linked/xsd/ontologies/xsd';
import { Shape } from '@_linked/core/shapes/Shape';
import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Person } from './Person.js';

@linkedShape({
  name: 'BefriendAction',
  description:
    'An action of establishing a friendship relationship. Represents social connections with agent and object person relationships. (friend request, connection, social)',
})
export class BefriendAction extends Shape {
  static targetClass = schema.BefriendAction;
  // readonly FAILED_ACTION_STATUS = 0;
  // readonly ACTIVE_ACTION_STATUS = 1;
  // readonly COMPLETED_ACTIVE_STATUS = 2;
  // readonly POTENTIAL_ACTION_STATUS =3

  @literalProperty({
    path: schema.actionStatus,
    maxCount: 1,
  })
  get actionStatus(): number {
    return 0;
  }

  //the person who makes the connection
  @objectProperty({
    path: schema.agent,
    shape: Person,
    maxCount: 1,
  })
  get agent(): Person {
    return null;
  }

  //the person that gets connected by the other
  @objectProperty({
    path: schema.object,
    shape: Person,
    maxCount: 1,
  })
  get object(): Person {
    return null;
  }
}
