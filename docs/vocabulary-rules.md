---
summary: >
  The rules @_linked/schema's shapes and terms follow: the package mirrors schema.org and holds
  only schema.org's terms; each shape targets its own schema.org class and extends the shape of
  that class's superclass; a property's cardinality comes from what the ontology states, and
  where it states nothing (schema.org never does), from the property's description.
---

# Vocabulary rules

`@_linked/schema` mirrors [schema.org](https://schema.org) (`linkedPackage('@_linked/schema',
{mirrors: 'http://schema.org/'})`). The same rules hold for every package that mirrors a published
standard (`@_linked/dcat`, `dcmi`, `org`, `sioc`, `owl`, `rdfs`, `xsd`); CN's arch-03
(§Standard-vocabulary packages) states them for all of them.

## Only schema.org's terms

- `src/data/schema.ttl` is schema.org's vocabulary (namespace `http://schema.org/`, see the note
  in `src/ontologies/schema.ts`). Every shape's target class and property paths, and every term
  `src/ontologies/schema.ts` exports, is defined there. The shape check reports any other
  `schema:` IRI as `mirror-undefined-term`, from this package or from any package that uses one.
- A custom shape, or a term schema.org does not define, lives in its own package and namespace.
  Its class may be `rdfs:subClassOf` a schema.org class; its shape then extends that class's
  shape.
- To refresh the data from a schema.org release: [backlog 002](backlog/002-refresh-schema-org-data.md).

## Shapes follow the class hierarchy

- A shape targets its own class: `PostalAddress` targets `schema:PostalAddress`, not the
  `schema:Thing` of the shape it extends.
- `A extends B` only where schema.org states `A rdfs:subClassOf* B`, and a shape whose class is a
  subclass of a shaped class extends that shape (through the nearest shaped ancestor:
  `BefriendAction` extends `Action`, since `InteractAction` has no shape).
- `tests/shape-check.test.mjs` runs core's shape check over every shape here and expects no
  finding.

## Cardinality

A property gets `maxCount: 1` when the ontology says it has one value, and stays multi-valued
otherwise:

1. **What the ontology states decides:** `owl:FunctionalProperty`, `owl:maxCardinality` (or
   `owl:cardinality`) on a restriction.
2. **Where it states nothing, the property's description decides.** schema.org states no
   cardinality for any property (`schema:domainIncludes` and `schema:rangeIncludes` only), so for
   this package the description always decides:
   - a single role gets `maxCount: 1`: `agent`, "*The* direct performer or driver of the action";
     `object`, "*The* object upon which the action is carried out"; `actionStatus`, "the current
     disposition of the Action"; the event a `JoinAction` joins;
   - a plural one stays multi-valued: `participant`, "*Other co-agents* that participated in the
     action indirectly".
3. A shape may tighten an inherited property (a `minCount`, a lower `maxCount`, a narrower class),
   never widen it; core's tighten-only check refuses the rest.

A multi-valued property's accessor is plural or returns a `ShapeSet` (`participant:
ShapeSet<Person>`); a single-valued one returns the value.
