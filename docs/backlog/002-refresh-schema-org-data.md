---
summary: >
  How to refresh src/data/schema.ttl from a schema.org release with scripts/write-turtle.mjs.
  The data is version 30.1 (refreshed 2026-10-24 from the older release converted from the
  package's former JSON-LD); repeat on each schema.org release.
---

# 002 — Refresh the schema.org data from the current release

## Why

Until version 30.1, `src/data/schema.ttl` was the package's former `schema.json` (an older schema.org release,
2,801 subjects, 952 `rdfs:subClassOf`), converted unchanged to Turtle. Terms schema.org added
since were missing: `observationAbout` was added by hand from the current release
([report 004](../reports/004-turtle-data-and-schema-org-terms.md)). The shape check reports any
`schema:` IRI the data does not define, so a shape that needs a newer term fails the build until
the data has it.

## How

```sh
curl -sSL https://schema.org/version/<version>/schemaorg-current-https.nt \
  | node scripts/write-turtle.mjs > body.ttl
```

The writer rewrites `https://schema.org/` to `http://schema.org/` (the package's namespace),
keeps `schema:isPartOf` objects as published, and writes deterministic Turtle, so the diff is
schema.org's changes. Then:

- put the four-line source comment of the current `src/data/schema.ttl` above `body.ttl`, with the
  new version, as the new `src/data/schema.ttl`, and set the version in `schema-added.ttl`;

- run `npx linked generate-ontology` to regenerate `src/ontologies/` (`linked build` fails until
  then); a term schema.org removed then fails `tsc` in any shape that uses it;
- review removed terms and changed `rdfs:subClassOf` against `src/shapes/` (`npm test` runs the
  shape check);
- note in the changeset what changed in the class hierarchy: apps sync it into every dataset,
  and the store infers types from it.

## Answered

- The release has no `schema:` header of its own; `schema-added.ttl` holds the ontology entity
  (README §The data).
- A removed class or a changed superclass ships as a minor with the changes listed in the
  changeset (the owner's semver policy for small breaking changes).
