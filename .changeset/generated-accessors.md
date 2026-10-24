---
"@_linked/schema": minor
---

The `schema` accessor modules are generated from `src/data/schema.ttl` and `schema-added.ttl` by
`linked generate-ontology` (`package.json` `"linkedOntologies"`), and `linked build` fails when
they are stale. `ontologies/schema` exports one named term for each of schema.org's 2,802
subjects (up from 132), each `/*#__PURE__*/`, so a bundler keeps only the terms used. The README
explains the namespace import.

Breaking changes:

- The aggregated `schema` object is gone. Import the module as a namespace:

  ```ts
  import * as schema from '@_linked/schema/ontologies/schema';
  static targetClass = schema.Person;
  ```

- `ns`, `dataFiles`, `loadData` and `_ontologyResource` moved to
  `@_linked/schema/ontologies/schema.data`; `import * as schema` no longer reaches them, and the
  registered ontology carries only its terms.
- Terms whose local name is not an identifier, new in this release: `schema:3DModel` →
  `_3DModel`, `schema:yield` → `yield_`. No previously exported name changed.
- The shapes import `@_linked/xsd` 1.4's namespace module. Requires `@_linked/core` ^2.41.0 and
  `@_linked/xsd` ^1.4.0.
