---
summary: >
  Major. schema.org data ships as Turtle (schema.ttl, schema-added.ttl; 16,204 + 6 triples
  unchanged, plus observationAbout's 7) read through core's loadOntologyFiles, written by a
  committed deterministic writer; the package mirrors http://schema.org/. Shapes follow schema.org's
  class hierarchy (9 new extends, PostalAddress and DataFeedItem target their own classes), hold
  only schema.org terms (ArtBlock, isMarried, childItem(s), teamID removed), and Action's
  properties follow the cardinality rule (participant multi-valued, object single). The shape
  check finds nothing. Rules in docs/vocabulary-rules.md.
---

# 004 — Turtle data, schema.org's hierarchy and only schema.org's terms

Step P1 of CN plan 070 (store inference and ontology data), on the `store-inference` integration
branch; released with the plan's release PR. Changeset: **major**
(`.changeset/store-inference-schema-terms.md`, which lists every breaking change).

## Why

The store infers `rdf:type` through `rdfs:subClassOf`, and core syncs each package's class
hierarchy into every app dataset from Turtle data. SHACL targeting follows the hierarchy, so a
shape tree that disagrees with schema.org's class tree validates and queries nodes nobody meant
to. A package that mirrors a standard holds only that standard's terms (plan 070 decisions 13-18).

## Phases

1. **Data to Turtle** (`cf9a1f0`). `schema.json` and `schema-added.json` converted with jsonld
   8.3.3 (scratch install) to N-Quads, then with `scripts/write-turtle.mjs` to `schema.ttl`
   (991,635 B) and `schema-added.ttl`. The writer is committed for the refresh
   ([backlog 002](../backlog/002-refresh-schema-org-data.md)): fixed prefix block, subjects sorted,
   `a` first, predicates and objects sorted, one predicate per line; it reads N-Triples itself
   (no dependency, so the build's dependency check stays clean), refuses blank nodes and named
   graphs, rewrites `https://schema.org/` to `http://schema.org/` except `schema:isPartOf`
   objects. `observationAbout`'s 7 triples come from `schemaorg-current-https.nt` (2026-10-21).
   `loadData` reads `dataFiles` through `loadOntologyFiles`; `schema.register.ts` passes
   `dataFiles`; `linkedPackage('@_linked/schema', {mirrors: 'http://schema.org/'})`.
2. **Shapes** (`84bba9e`). Decision 18's schema items; `tests/shape-check.test.mjs`.
3. **Docs** (this commit): `docs/vocabulary-rules.md` (the mirror rule and the cardinality
   rule), backlog 002, this report, the changeset.

## Change

- Extends: `Comment`, `Conversation` → `CreativeWork`; `ListItem`, `ItemList`, `PropertyValue`,
  `Observation` → `Intangible`; `Country` → `AdministrativeArea`; `BefriendAction`, `JoinAction`
  → `Action`. Leaves extend through the parent's `.class.js` module and import its public module
  for the registration closure (the rule in `Thing.ts`); `PostalAddress.class.ts` imports only
  `Intangible.class.js`.
- Own classes: `PostalAddress` → `schema:PostalAddress` (extends `Intangible`; schema.org:
  `PostalAddress ⊑ ContactPoint ⊑ StructuredValue ⊑ Intangible`, no shapes in between);
  `DataFeedItem` → `schema:DataFeedItem`. Both terms exported.
- Removed: `ArtBlock`, `Person.isMarried`, `Comment.childItem`/`childItems`, terms `isMarried`,
  `childItem`, `teamID`.
- Action, by the cardinality rule: `participant` a `ShapeSet<Person>` ("Other co-agents");
  `agent`, `actionStatus`, `location`, `startTime`, `endTime` stay single; `schema:object`
  ("The object upon which the action is carried out") becomes the single `object` (was the
  multi-valued `objects`). `JoinAction` drops `agents`; `BefriendAction` drops its own
  `actionStatus`, `agent` and `object` (a `Person`, sharing `schema:object` with Action's
  property under another label) and uses Action's.
- `Event` needed nothing: `image` inherits `contains` from `Thing.image` (core report 042).

## Verification

Shape check before phase 2 (data as Turtle, shapes unchanged), scoped to this package: 27
findings, exactly the plan's prediction: `extends-without-subclass` DataFeedItem;
`subclass-without-extends` for ArtBlock, BefriendAction, Comment, Conversation, Country,
ItemList, JoinAction, ListItem, Observation, PropertyValue; `borrowed-target-class` ArtBlock,
CreativeWork, DataFeedItem, PostalAddress, VisualArtwork; `mirror-undefined-term` childItem,
isMarried, teamID (exported and used). `observationAbout` cleared by its added triples.

Quick gate after phase 1 (`rm -rf lib`, build, `ls lib/esm/data`, `npm test`):

```
✔ Build successful
schema-added.ttl
schema.ttl
# tests 96
# pass 96
# fail 0
( node ~/web/wt/070/packages-local/_linked-cli/lib/esm/launch.js build 2>&1 |)  13.01s user 2.15s system 291% cpu 5.192 total
```

Loader and reader on the built lib (phase 1):

```
files 2 bytes 991544/846 subClassOf kept 952 non-schema superclasses http://schema.org/DataType ⊑ http://www.w3.org/2000/01/rdf-schema#Class
```

Quick gate after phase 2: build `✔ Build successful` (5.6 s); `npm test` `# tests 97 # pass 97
# fail 0` (0.64 s). Unscoped shape check over every registered shape (schema and its
dependencies): `all findings (no dependencies map): 0`. Each public shape module imported alone
in a fresh process: no error.

Full gate (`rm -rf lib`, build, `ls lib/esm/data`, `npm test`), before landing:

```
✔ Build successful
schema-added.ttl
schema.ttl
# tests 97
# suites 12
# pass 97
# fail 0
( rm -rf lib && node ~/web/wt/070/packages-local/_linked-cli/lib/esm/launch.j)  13.34s user 2.12s system 277% cpu 5.568 total
```

Verify (the Turtle in `lib/esm/data` parsed with N3.js against the JSON-LD's N-Quads from jsonld,
as sets of N-Triples lines):

```
schema.ttl parsed 16211 triples; JSON-LD 16204 N-Quads + 7 observationAbout; missing 0, extra 0
schema-added.ttl parsed 6 triples; JSON-LD 6 N-Quads; missing 0, extra 0
```

The writer is idempotent: rewriting the jsonld N-Quads gives `schema.ttl` byte for byte, and it
converts schema.org's current `.nt` release (1,101,977 B of Turtle) without error.

## Effects on consumers (CN: C2)

- `src/pages/ComponentShapeConverter.tsx:97,112,130` compare a label to `isMarried` (dead); test
  data `infra/peacegame/production-copy-for-test-env.n3`, `infra/fuseki/test-data/pg-production-copy.n3`
  mention `isMarried`/`childItem`.
- Stored addresses typed `schema:Thing` and data feed items typed `schema:CreativeWork` are no
  longer selected by `PostalAddress`/`DataFeedItem`; CN and packages-local have no code using
  `JoinAction`, `BefriendAction`, `Action.participant`/`objects`, `ArtBlock` or `childItem`.
- Every `schema:` IRI a CN shape uses must be in `schema.ttl`; the mirror check reports the rest
  against this package.
- `@_linked/org` and `@_linked/sioc` raise their `@_linked/schema` range to this major at release.

## Follow-ups

- Refresh the data from schema.org's current release: [backlog 002](../backlog/002-refresh-schema-org-data.md).
- Core range `^2.36.0` rises to the release with `loadOntologyFiles` (plan 070, step R).

## Known limits

Only Action's properties were checked against the cardinality rule (plan 070 decision 18); the
rule (`docs/vocabulary-rules.md`) applies to every other property when it is next touched.
