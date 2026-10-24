import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import * as schema from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { Place } from './Place.js';
import { Thing } from './Thing.js';
import { PostalAddress } from './PostalAddress.js';
import * as xsd from '@_linked/xsd/ontologies/xsd';
import type { DefinedTerm } from './DefinedTerm.js';
// Registers DefinedTerm, which `skills` names rather than references: DefinedTerm
// extends CreativeWork, whose module registers Person, so a class reference here
// would read `DefinedTerm` before it is initialised when DefinedTerm loads first.
import './DefinedTerm.js';
import { AdministrativeArea } from './AdministrativeArea.js';

@linkedShape({
  name: 'Person',
  description:
    'A person (alive, dead, fictional); can be a member, leader, or contact for organizations. Holds identifiers and contact details. (individual, human, actor, user)',
})
export class Person extends Thing {
  static targetClass = schema.Person;

  @literalProperty({
    path: schema.givenName,
    maxCount: 1,
    description: 'The given name of the person.',
  })
  get givenName(): string {
    return '';
  }

  @literalProperty({
    path: schema.familyName,
    maxCount: 1,
    description: 'The family name of the person.',
  })
  get familyName(): string {
    return '';
  }

  @literalProperty({
    path: schema.name,
    maxCount: 1,
    description:
      'Use as optional altnertive name. Is more likely to have a defined givenName and familyName as primary names.',
  })
  get name(): string {
    return '';
  }

  @literalProperty({
    path: schema.gender,
    maxCount: 1,
    // in: [
    //   new Literal('male'),
    //   new Literal('female'),
    //   new Literal('prefer not to say'),
    // ],
  })
  get gender(): string {
    return '';
  }

  @literalProperty({
    path: schema.telephone,
    maxCount: 1,
  })
  get telephone(): string {
    return '';
  }

  @literalProperty({
    path: schema.birthDate,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get birthDate(): Date {
    return null;
  }

  static getAge(birthDate: Date) {
    // if (this.hasProperty(schema.birthDate) === false) return null;
    var today = new Date();
    // var birthDate = this.birthDate;
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  @objectProperty({
    path: schema.birthPlace,
    shape: Place,
    maxCount: 1,
  })
  get birthPlace(): Place {
    return null;
  }

  @objectProperty({
    path: schema.knows,
    shape: Person,
  })
  get knows(): ShapeSet<Person> {
    return new ShapeSet<Person>();
  }

  @objectProperty({
    path: schema.skills,
    shape: ['@_linked/schema', 'DefinedTerm'],
  })
  get skills(): ShapeSet<DefinedTerm> {
    return new ShapeSet<DefinedTerm>();
  }

  @literalProperty({
    path: schema.jobTitle,
    maxCount: 1,
  })
  get jobTitle(): string {
    return '';
  }

  //TODO: schema.hasOccupation -> schema:Occupation (shape to be created)
  @literalProperty({
    path: schema.hasOccupation,
    maxCount: 1,
  })
  get hasOccupation(): string {
    return '';
  }

  @objectProperty({
    path: schema.homeLocation,
    shape: Place,
  })
  get homeLocation(): ShapeSet<Place> {
    return new ShapeSet<Place>();
  }

  @literalProperty({
    path: schema.honorificPrefix,
    maxCount: 1,
  })
  get honorificPrefix(): string {
    return '';
  }

  // TODO: remove this after do migration restructure location
  @objectProperty({
    path: schema.areaServed,
    shape: Person,
    maxCount: 1,
  })
  get areaServed(): AdministrativeArea {
    return null;
  }

  @objectProperty({
    path: schema.address,
    shape: PostalAddress,
    maxCount: 1,
  })
  get address(): PostalAddress {
    return null;
  }
}
