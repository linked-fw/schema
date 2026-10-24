import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { linkedShape } from '../package.js';
import { Person } from './Person.js';
import * as schema from '../ontologies/schema.js';
import { Thing } from './Thing.js';

@linkedShape({
  name: 'Organization',
  description:
    'An organization such as a school, NGO, corporation, club, etc.; has members, leaders, and contact info. Links to Person and Address. (org, company, group, institution)',
})
export class Organization extends Thing {
  static targetClass = schema.Organization;

  @literalProperty({
    path: schema.faxNumber,
    maxCount: 1,
  })
  get faxNumber(): string {
    return '';
  }

  @literalProperty({
    path: schema.email,
    maxCount: 1,
  })
  get email(): string {
    return '';
  }

  @literalProperty({
    path: schema.legalName,
    maxCount: 1,
  })
  get legalName(): string {
    return '';
  }

  @literalProperty({
    path: schema.address,
    maxCount: 1,
  })
  get address(): string {
    return '';
  }

  @literalProperty({
    path: schema.telephone,
    maxCount: 1,
  })
  get telephone(): string {
    return '';
  }

  static getAffiliationsOf(person: Person) {
    return Organization.select((organization) => organization);
  }

  @objectProperty({
    path: schema.members,
    shape: Person,
  })
  get members(): ShapeSet<Person> {
    return new ShapeSet<Person>();
  }

  @objectProperty({
    path: schema.founder,
    shape: Person,
    maxCount: 1,
  })
  get founder(): Person {
    return null;
  }
}
