# @_linked/schema

[schema.org](https://schema.org) for Linked: its vocabulary as Turtle, an accessor for every term,
and shapes for the classes Linked apps use. The package mirrors schema.org and holds only its terms
([vocabulary rules](https://github.com/linked-fw/schema/blob/main/docs/vocabulary-rules.md)).

## Terms

Import the terms module as a namespace:

```ts
import * as schema from '@_linked/schema/ontologies/schema';

static targetClass = schema.Person; // {id: 'http://schema.org/Person'}
```

`ontologies/schema` exports one named term for each of schema.org's 3,023 subjects, and nothing
else. A namespace import is the one way to use them:

- **It reads like the Turtle.** `schema.Person` is `schema:Person`, and the prefix says which
  vocabulary a term comes from, also where several are used side by side (`schema.name`,
  `rdfs.label`).
- **It tree-shakes.** Every term is a `/*#__PURE__*/` named export, so a bundler keeps only the
  terms a module uses. On the 2,802-term release,
  [cli report 027](https://github.com/linked-fw/cli/blob/main/docs/reports/027-ontology-accessor-generator.md)
  measured a 402,091-byte module and, with esbuild (minified), a 125,759-byte bundle when every
  term is kept, against 1,868 bytes for `schema.Person` alone: 18 bytes more than a bundle with
  no terms (1,850). An aggregated object would keep them all.

Names are generated, one rule for all: a character that cannot appear in an identifier becomes
`_`, a leading digit gets a leading `_` (`schema:3DModel` → `schema._3DModel`), and a reserved word
gets a trailing `_` (`schema:yield` → `schema.yield_`). There are no aliases.

`ns`, `dataFiles`, `loadData()` and `_ontologyResource` are in `@_linked/schema/ontologies/schema.data`:

```ts
import {ns} from '@_linked/schema/ontologies/schema.data';
```

Importing the package root (`@_linked/schema`) or `shapes/index` registers the ontology, which
keeps every term;
import `ontologies/schema` directly where bundle size matters.

## The data

`src/data/schema.ttl` is schema.org's latest release, **version 30.1**,
<https://schema.org/version/30.1/schemaorg-current-https.nt>, written as Turtle by
`scripts/write-turtle.mjs` and otherwise unchanged; a leading comment names the source. The
namespace is `http://schema.org/`, not schema.org's preferred `https://schema.org/`: tools like
jsonld convert every schema.org IRI to http, so the writer rewrites https on import (except
`schema:isPartOf` objects, kept as published). Every other file uses http too. To refresh the data
from a schema.org release: [backlog 002](https://github.com/linked-fw/schema/blob/main/docs/backlog/002-refresh-schema-org-data.md).

The official files are the only source of the package's terms: the package never adds a class
or property to a standard's namespace. What the published standard lacks, mainly metadata, goes
in one extra file per prefix, `src/data/<prefix>-added.ttl`, listed in `"linkedOntologies"`' data:

- the ontology entity itself: `owl:Ontology`, title, description,
  `vann:preferredNamespacePrefix`, `vann:preferredNamespaceUri`, the source URL and version;
- annotations on terms the standard already defines, such as a missing `rdfs:label`.

New classes or properties never go there; a term a standard lacks belongs in the consumer's own
ontology package.

schema.org's data does not describe the namespace itself, so `src/data/schema-added.ttl` holds the
ontology entity: `schema:` as an `owl:Ontology`, its title, description and label, the preferred
prefix and namespace, and the source and version.

`linked generate-ontology` writes the three modules in `src/ontologies/` from the data
(`package.json` `"linkedOntologies"`); `linked build` fails when they are out of date. Never edit
them by hand.

## Development

```bash
npx linked build    # checks the ontology modules, compiles, writes lib/esm/data/shapes.ttl
npm test            # runs against lib/
```
