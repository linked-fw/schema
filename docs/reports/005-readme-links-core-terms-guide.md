---
date: 2026-10-24
summary: >
  The README's §Terms links core's new "Using ontology terms" section. No code changed. Patch.
---

# 005 — README links core's terms guide

## What changed

- `README.md` §Terms ends with a link to
  [core's "Using ontology terms"](https://github.com/linked-fw/core#using-ontology-terms), which
  states the rule for every vocabulary: namespace imports, accessors over `{id}`, `{id}` only for
  a namespace without a module.

## Gate

- `npx linked build`: "✔ Build successful".
- `npm test`: "# pass 97 / # fail 0".

## PR

### Summary

Links core's "Using ontology terms" from the README.

### Changes

- `README.md` §Terms: one link.

### Verification

- `npx linked build`: "✔ Build successful"; `npm test`: "# pass 97 / # fail 0".

### Deviations

None.

### Follow-ups

None.
