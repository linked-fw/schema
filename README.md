# @_linked/schema

[schema.org](https://schema.org) for Linked: its vocabulary as Turtle, an accessor for every term,
and shapes for the classes Linked apps use. The package mirrors schema.org and holds only its terms
([vocabulary rules](docs/vocabulary-rules.md)).

## Terms

Import the terms module as a namespace:

```ts
import * as schema from '@_linked/schema/ontologies/schema';

static targetClass = schema.Person; // {id: 'http://schema.org/Person'}
```

`ontologies/schema` exports one named term for each of schema.org's 2,802 subjects, and nothing
else. A namespace import is the one way to use them:

- **It reads like the Turtle.** `schema.Person` is `schema:Person`, and the prefix says which
  vocabulary a term comes from, also where several are used side by side (`schema.name`,
  `rdfs.label`).
- **It tree-shakes.** Every term is a `/*#__PURE__*/` named export, so a bundler keeps only the
  terms a module uses. The whole module is 402,091 bytes of source (125,759 bytes minified when
  every term is kept); a bundle that uses `schema.Person` alone costs 18 bytes more than one with
  no terms at all (1,868 against 1,850 bytes, esbuild, minified), as measured in cli report 027.
  An aggregated object would keep all 2,802.

Names are generated, one rule for all: a character that cannot appear in an identifier becomes
`_`, a leading digit gets a leading `_` (`schema:3DModel` → `schema._3DModel`), and a reserved word
gets a trailing `_` (`schema:yield` → `schema.yield_`). There are no aliases.

`ns`, `dataFiles`, `loadData()` and `_ontologyResource` are in `@_linked/schema/ontologies/schema.data`:

```ts
import {ns} from '@_linked/schema/ontologies/schema.data';
```

Importing the package root (`@_linked/schema`) registers the ontology, which keeps every term;
import `ontologies/schema` directly where bundle size matters.

## The data

`src/data/schema.ttl` is schema.org's vocabulary, `src/data/schema-added.ttl` describes the ontology
itself (`schema:` as an `owl:Ontology`). The namespace is `http://schema.org/`, not schema.org's preferred
`https://schema.org/`: tools like jsonld convert every schema.org IRI to http, and
`scripts/write-turtle.mjs` rewrites https on import. Every other file uses http too. To refresh
the data from a schema.org release: [backlog 002](docs/backlog/002-refresh-schema-org-data.md).

`linked generate-ontology` writes the three modules in `src/ontologies/` from the data
(`package.json` `"linkedOntologies"`); `linked build` fails when they are out of date. Never edit
them by hand.

## Development

```bash
npx linked build    # checks the ontology modules, compiles, writes lib/esm/data/shapes.ttl
npm test            # runs against lib/
```
