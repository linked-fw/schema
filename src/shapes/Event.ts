import { xsd } from '@_linked/xsd/ontologies/xsd';
import { ShapeSet } from '@_linked/core/collections/ShapeSet';
import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { schema } from '../ontologies/schema.js';
import { linkedShape } from '../package.js';
import { ImageObject } from './ImageObject.js';
import { Person } from './Person.js';
import { Place } from './Place.js';
import { Thing } from './Thing.js';

@linkedShape({
  description:
    'An occurrence happening at a certain time and location. Represents events with start/end dates, attendees, and location. (occurrence, happening, gathering)',
})
export class Event extends Thing {
  static targetClass = schema.Event;

  @literalProperty({
    path: schema.startDate,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get startDate(): Date {
    return null;
  }

  @literalProperty({
    path: schema.endDate,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get endDate(): Date {
    return null;
  }

  @objectProperty({
    path: schema.attendee,
    shape: Person,
  })
  get attendees(): ShapeSet<Person> {
    return new ShapeSet<Person>();
  }

  @objectProperty({
    path: schema.location,
    shape: Place,
    maxCount: 1,
  })
  get location(): Place {
    return null;
  }

  @objectProperty({
    path: schema.image,
    shape: ImageObject,
    maxCount: 1,
  })
  get image(): ImageObject {
    return null;
  }

  @objectProperty({
    path: schema.superEvent,
    shape: Event,
    maxCount: 1,
  })
  get superEvent(): Event {
    return null;
  }
}
