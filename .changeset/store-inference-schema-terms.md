---
"@_linked/schema": major
---

Ontology data is Turtle, the shapes follow schema.org's class hierarchy, and the package holds only schema.org's terms. Needs `@_linked/core` with `loadOntologyFiles` and the shape check, and a build that copies `src/**/*.ttl` into `lib/`.

**Data.** `src/data/schema.json` and `schema-added.json` are replaced by `schema.ttl` and `schema-added.ttl` (the same triples, plus `schema:observationAbout` from schema.org's current release). `loadData` resolves to the Turtle texts (`string[]`) through core's `loadOntologyFiles`, server side only; the package declares `mirrors: 'http://schema.org/'`. `lib/esm/data/*.json` no longer exist.

**Breaking changes.**

- Removed, not schema.org terms: the `ArtBlock` shape (`@_linked/schema/shapes/ArtBlock`), `Person.isMarried`, `Comment.childItem` and `Comment.childItems`, and the terms `schema.isMarried`, `schema.childItem`, `schema.teamID`.
- `PostalAddress` targets `schema:PostalAddress` (was `schema:Thing`) and extends `Intangible`; `DataFeedItem` targets `schema:DataFeedItem` (was `schema:CreativeWork`). Stored nodes typed with the old class are no longer selected by these shapes. The terms `schema.PostalAddress` and `schema.DataFeedItem` are new.
- New `extends`, with what each shape now inherits:
  - `Comment` (and so `Answer`) and `Conversation` extend `CreativeWork` (were `Thing`): they gain `creator`, `creditText`, `usageInfo`, `copyrightNotice`, `text`, `dateCreated`, `dateModified`, `headline`, and are `instanceof CreativeWork`.
  - `ListItem`, `ItemList`, `PropertyValue` extend `Intangible` (were `Shape`): they gain Thing's `name`, `alternateName`, `description`, `disambiguatingDescription`, `identifier`, owned `image` (a delete of the node deletes its image), `mainEntityOfPage`, `sameAs`, `subjectOf`, `url`, `additionalType`. `Observation` extends `Intangible` (was `Thing`).
  - `Country` extends `AdministrativeArea` (was `Place`).
  - `BefriendAction` and `JoinAction` extend `Action` (were `Shape`): they gain Thing's properties and Action's, including `agent` with `minCount: 1` and an `xsd:integer` `actionStatus`.
- `Action.participant` is a `ShapeSet<Person>` without `maxCount` (was a single `Person`).
- `Action.objects` (multi-valued) is replaced by `Action.object`, a single `Thing` (`maxCount: 1`): schema.org describes `object` as "the object upon which the action is carried out".
- `JoinAction` drops its own `agents`: the joiner is `agent`, others joining with them are `participant`.
- `BefriendAction` drops its own `actionStatus`, `agent` and `object` (a `Person`) and uses Action's; `object` is typed `Thing`.

The rules behind these changes, including how a property's cardinality is decided, are in `docs/vocabulary-rules.md`.
