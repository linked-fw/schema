---
summary: >
  @_linked/schema depends on lincd-mui-base for a single Button import in
  ImageUploader, and that one dependency roots the largest advisory subtree any
  Linked consumer inherits: lincd -> rdflib -> the npm package named
  "package.json" -> git-source/git-up/git-package-json -> parse-url, gry and tmp,
  carrying several criticals. None of it is ever loaded. The dependency is real
  and cannot simply be dropped, so this needs a decision about how to keep the
  component without the subtree.
---

# 001 — `lincd-mui-base` roots an advisory subtree nothing loads

## The problem

`@_linked/schema` declares `lincd-mui-base: ~1.0`. It is a **genuine runtime
dependency** — this was initially misdiagnosed as dead weight and it is not:

- `src/components/ImageUploader.tsx:3` — `import { Button } from 'lincd-mui-base/components/Button';`
- `src/index.tsx:43` — `import './components/ImageUploader.js';`

So the component ships in the built `lib/`, and removing the dependency breaks
the package entry point. That was verified rather than assumed, after a first
pass wrongly cleared it.

What makes it worth a backlog item is what comes with it. Every consumer of
`@_linked/schema` — which in practice is every Linked app — inherits:

```
@_linked/schema -> lincd-mui-base -> lincd -> rdflib@2.4.0
                                          -> package.json@2.0.1
                                             -> git-source -> git-url-parse -> git-up -> parse-url
                                             -> git-package-json -> gry, tmp
                                             -> package-json -> got@5.6.0
```

`rdflib@2.4.0` depends on the npm package literally named **`package.json`**, a
"fetch a repo's package.json from GitHub" helper. That branch carries several
critical advisories plus `gry` (command injection) and `tmp` (path traversal).

**None of it is ever loaded.** No Linked package imports `lincd`, `rdflib` or
anything below them; the whole subtree arrives because one component wants one
`Button`.

## Why it matters

Advisories on unreachable code are still real cost. They appear in every
consumer's `npm audit`, in dependency scanners, and in any compliance review, so
each one has to be triaged by hand and re-triaged on the next audit. The
criticals here are the loudest entries in the tree for downstream apps.

Worth noting for triage: `rdflib@2.4.1` dropped the `package.json` dependency
and satisfies `lincd`'s existing range, so a plain `npm audit fix` already
resolves much of this for a consumer. That is a per-consumer workaround, not a
fix in this package.

## Relevant files and packages

- `src/components/ImageUploader.tsx` — the only importer.
- `src/index.tsx:43` — pulls the component into the entry point.
- `package.json` — the `lincd-mui-base: ~1.0` dependency.
- Sibling precedent: `@_linked/xsd` carried `lincd-rdfs` for the same historical
  reason, but nothing imported it, so it was simply removed (linked-fw/xsd#12).
  That is the easy version of this problem; this is the hard one.

## First open questions

1. **Does `ImageUploader` still need to be in `src/index.tsx`?** If the entry
   point does not have to pull it in, the dependency could become optional or
   move behind a subpath consumers opt into.
2. **Is a `Button` from `lincd-mui-base` load-bearing?** It is one component.
   A plain element, a local component, or `@_linked/ui` may cover it, which would
   let the dependency go entirely.
3. **Is `lincd-mui-base` maintained, and could it drop `lincd`?** If its own
   dependency on `lincd` is as incidental as this one, fixing it upstream helps
   every consumer at once.
4. **Should `lincd`/`rdflib` be reachable from the Linked framework at all?**
   `lincd` is the predecessor project. Its presence in a modern dependency tree
   may be entirely vestigial, in which case the question is bigger than this
   package.
5. If none of the above lands, is a pinned `overrides` entry on `rdflib` in the
   framework's own tooling worth it, or is that a consumer's call?

## Not in scope here

Removing the dependency outright. That was tried and rejected: it breaks the
package. Any fix has to keep `ImageUploader` working or deliberately change what
the entry point exports.
