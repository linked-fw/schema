import type { NodeReferenceValue } from '@_linked/core/utils/NodeReference';
import { Shape } from '@_linked/core/shapes/Shape';
import { literalProperty, objectProperty } from '@_linked/core/shapes/SHACL';
import { linkedShape } from '../package.js';
import { schema } from '../ontologies/schema.js';

@linkedShape({
  name: 'Thing',
  description:
    'The most generic type in Schema.org; superclass for all entities. Can be a person, place, organization, product, etc. (entity, resource, item)',
})
export class Thing extends Shape {
  static targetClass = schema.Thing;

  /**
   * An alias for the item.
   */
  @literalProperty({
    path: schema.alternateName,
    maxCount: 1,
  })
  get alternateName(): string {
    return '';
  }

  /**
   * A description of the item.
   */
  @literalProperty({
    path: schema.description,
    maxCount: 1,
  })
  get description(): string {
    return '';
  }

  /**
   * A sub property of description. A short description of the item used to disambiguate from other, similar items. Information from other properties (in particular, name) may be necessary for the description to be useful for disambiguation.
   */
  @literalProperty({
    path: schema.disambiguatingDescription,
    maxCount: 1,
  })
  get disambiguatingDescription(): string {
    return '';
  }

  /**
   * The identifier property represents any kind of identifier for any kind of Thing, such as ISBNs, GTIN codes, UUIDs etc. Schema.org provides dedicated properties for representing many of these, either as stringual strings or as URL (URI) links. See background notes for more details.
   */
  @literalProperty({
    path: schema.identifier,
    maxCount: 1,
  })
  get identifier(): string {
    return '';
  }

  /**
   * An image of the item.
   */
  @objectProperty({
    path: schema.image,
    // Named, not imported: ImageObject extends Thing, so importing it here
    // would close a cycle. Naming it does not register it — `./Thing.ts`
    // (the public module) does that.
    shape: ['@_linked/schema', 'ImageObject'],
    maxCount: 1,
    // An entity owns its image node — cascade-delete the ImageObject when the
    // image is replaced/removed, so updates don't leave orphaned ImageObjects.
    contains: true,
  })
  get image() {
    return null;
  }

  /**
   * Indicates a page (or other CreativeWork) for which this thing is the main entity being described. See background notes for details.
   */
  get mainEntityOfPage(): NodeReferenceValue {
    return null;
  }

  /**
   * The name of the item.
   */
  @literalProperty({
    path: schema.name,
    maxCount: 1,
  })
  get name(): string {
    return '';
  }

  /**
   * TODO: this causes circular references, we need to find the target shape in an indirect way
   * Indicates a potential Action, which describes an idealized action in which this thing would play an 'object' role.
   */
  // get potentialAction(): Action {
  //   return this.hasProperty(schema.potentialAction) ? new Action(this.getValue(schema.potentialAction)) : null;
  // }

  /**
   * a reference NamedNode that unambiguously indicates the item's identity. E.g. the item's Wikipedia page, Wikidata entry, or official website.
   */
  get sameAs(): NodeReferenceValue {
    return null;
  }

  /**
   * A CreativeWork or Event about this Thing.
   */
  //TODO: how to build get methods for 2 different value types? Note that data may not be loaded!
  // if we can assume some data is loaded. Do we validate the node against the shape?
  // get subjectOf(): CreativeWork | Event {
  //   return this.hasProperty(schema.subjectOf) ? new Event(this.getValue(schema.subjectOf)) : null;
  // }
  get subjectOf(): NodeReferenceValue {
    return null;
  }

  /**
   * URL of the item.
   */
  @literalProperty({
    path: schema.url,
    maxCount: 1,
  })
  get url(): string {
    return '';
  }

  /**
   * An additional type for the item, typically used for adding more specific types from external vocabularies in microdata syntax. This is a relationship between something and a class that the thing is in.
   */
  @literalProperty({
    path: schema.additionalType,
    maxCount: 1,
  })
  get additionalType(): string {
    return '';
  }
}
