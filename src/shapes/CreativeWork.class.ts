import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import * as schema from '../ontologies/schema.js';
import { linkedShape, packageName } from '../package.js';
import * as xsd from '@_linked/xsd/ontologies/xsd';
import { Thing } from './Thing.class.js';

@linkedShape({
  name: 'CreativeWork',
  description:
    'A work or composition that is the result of creative effort. Represents content with creator, dates, and copyright info. (content, work, creation)',
})
export class CreativeWork extends Thing {
  static targetClass = schema.CreativeWork;

  @objectProperty({
    path: schema.creator,
    maxCount: 1,
    shape: [packageName, 'Person'],
  })
  get creator() {
    return null;
  }

  @literalProperty({
    path: schema.creditText,
    maxCount: 1,
  })
  get creditText(): string {
    return '';
  }

  //@TODO: remove this once weve got a better solution for circular dependencies (see Thing get/set Image)

  @literalProperty({
    path: schema.usageInfo,
    maxCount: 1,
  })
  get usageInfo(): string {
    return '';
  }

  @literalProperty({
    path: schema.copyrightNotice,
    maxCount: 1,
  })
  get copyrightNotice(): string {
    return '';
  }

  @literalProperty({
    path: schema.text,
    maxCount: 1,
  })
  get text(): string {
    return '';
  }

  @literalProperty({
    path: schema.dateCreated,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get dateCreated(): Date {
    return null;
  }

  @literalProperty({
    path: schema.dateModified,
    maxCount: 1,
    datatype: xsd.dateTime,
  })
  get dateModified(): Date {
    return null;
  }

  @literalProperty({
    path: schema.headline,
    maxCount: 1,
  })
  get headline(): string {
    return '';
  }
}
