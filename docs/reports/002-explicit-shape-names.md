---
summary: >
  Every shape passes an explicit `name` (equal to its class name) to @linkedShape, so its IRI no
  longer follows constructor.name. A bundler renamed Person to Person3 (it shares its name with
  the term schema.Person) and the server answered "Cannot resolve shape". IRIs are unchanged; a
  guard test fails on any shape without a matching name. Released in 1.5.1.
---

# 002 — Explicit shape names so IRIs survive bundling

[#67](https://github.com/linked-fw/schema/pull/67), released in `@_linked/schema` 1.5.1.

## Why

`@linkedShape` builds a shape's IRI from `options.name ?? constructor.name`. Every shape here
shares its name with the ontology term it targets (`class Person`, `var Person = term('Person')`).
When a bundler puts both in one chunk it renames the class to keep the bindings apart. In a
Vite-prebundled browser chunk `Person` became `Person3`, the shape registered as
`https://linked.cm/shape/schema/Person3`, and the server answered "Cannot resolve shape".

Every shape gets a name, not only those that clash with a term: on `main` core's
`[linked] Shape '…3' … has a name ending in a digit` warning fired for all 36 shapes, including
`ArtBlock2`, `DataFeedItem2` and `PostalAddress2`, which collide with something else.

## Change

All 36 `@linkedShape({...})` decorators in `src/shapes/` (35 files; `DefinedTerm.ts` has two) pass
`name` equal to the class name. **No IRI changes.** `name` exists in `@_linked/core` since 2.22;
this package requires `^2.27.0`. No public API change.

```ts
@linkedShape({ name: 'Person', description: '…' })
export class Person extends Thing {
  static targetClass = schema.Person;
}
```

**Rule for this repo:** a new shape passes `name` equal to its class name; the guard test fails
otherwise.

## Tests

`tests/shape-names.test.mjs` (node:test, against the built `lib/`):
- scans `src` for every `@linkedShape` and fails on a shape whose `name` is missing or differs from
  its class name, and on a decorator it could not parse (so a new shape cannot slip past);
- checks each shape is registered through `getPackageShape(name)` with
  `shape.id === getNodeShapeUri('@_linked/schema', <ClassName>)`.

Verification at merge: `npm test` 92/92; removing `name: 'Person'` makes both tests fail. An
esbuild bundle of `lib/esm/shapes/index.js` renames the class to `Person3` both before and after
the fix; the IRI is `…/schema/Person3` on `main` and `…/schema/Person` with the fix.

## Known limits

The same problem exists in other linked-fw packages whose shapes have no explicit `name` and share
it with a term of their own ontology (found by scanning the `packages-local/` checkouts at the
time): auth (AuthCredential, Authentication, IdentityToken, Password, RefreshToken,
UsedOAuthNonce), dcat, dcmi, org, owl, rdfs, server-utils (Lincd_API_Client), sioc, translation,
semantu-webid-email (ClientConsent), and xsd (`Boolean` shadows the global). core, server and
react were already fine.

## Follow-ups

The list above is recorded only in the body of #67; no backlog item was opened in those repos.
