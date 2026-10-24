---
summary: >
  src/data/schema.ttl comes from an older schema.org release (16,204 triples, converted from the
  package's former JSON-LD) plus observationAbout's 7 triples from the current one. Refresh it
  from schema.org's current release with scripts/write-turtle.mjs, review the diff for terms the
  shapes use, and release it.
---

# 002 — Refresh the schema.org data from the current release

## Why

`src/data/schema.ttl` is the package's former `schema.json` (an older schema.org release,
2,801 subjects, 952 `rdfs:subClassOf`), converted unchanged to Turtle. Terms schema.org added
since are missing: `observationAbout` was, and was added by hand from the current release
([report 004](../reports/004-turtle-data-and-schema-org-terms.md)). The shape check reports any
`schema:` IRI the data does not define, so a shape that needs a newer term fails the build until
the data has it.

## How

```sh
curl -sSL https://schema.org/version/latest/schemaorg-current-https.nt \
  | node scripts/write-turtle.mjs > src/data/schema.ttl
```

The writer rewrites `https://schema.org/` to `http://schema.org/` (the package's namespace),
keeps `schema:isPartOf` objects as published, and writes deterministic Turtle, so the diff is
schema.org's changes. Then:

- run `npx linked generate-ontology` to regenerate `src/ontologies/` (`linked build` fails until
  then); a term schema.org removed then fails `tsc` in any shape that uses it;
- review removed terms and changed `rdfs:subClassOf` against `src/shapes/` (`npm test` runs the
  shape check);
- note in the changeset what changed in the class hierarchy: apps sync it into every dataset,
  and the store infers types from it.

## Open questions

- The current release's `schema:` header (`schema-added.ttl`) and the release's own ontology
  triples, if any: keep both or merge.
- Minor or major: a class removed from schema.org, or a superclass changed, changes what
  `sh:targetClass` selects in every app.
