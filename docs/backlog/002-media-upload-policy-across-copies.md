---
summary: >
  `configureMediaUploads()` writes a module-level `let configured` in `MediaUploadPolicy.ts`, so an
  uploader that reached another copy of the package reads the default policy, not the app's.
  Move it to core's `sharedState`.
packages: [schema]
---

# 002 — Media upload policy across copies

A module can be evaluated twice in one runtime (Vite's SSR runner and Node under `linked start`, or two browser bundles). The convention ([shared state and error brands](https://github.com/linked-fw/cli/blob/main/docs/architecture/shared-state-and-error-brands.md)) keeps caller-set module state on `globalThis` with `sharedState(pkg, name, init)` from `@_linked/core` 2.36.0, React contexts in that shared state, and brands error classes with `brandLinkedError` so consumers match them with `isLinkedError`. Each fix needs a test that loads a second copy of the module (`jest.isolateModulesAsync`, or a `?copy` query on the built file) and shows the state is shared.

Found by the survey for linked-fw/cli backlog 017.

`src/utils/MediaUploadPolicy.ts:55` `let configured`: `configureMediaUploads()` (app config) →
`getMediaUploadPolicy()` (uploaders). The only finding in this package; its term definitions are
constants.
