---
summary: >
  Backlog 002 done: the media upload policy that `configureMediaUploads()` sets now lives in
  `@_linked/core`'s `sharedState` on `globalThis`, so an uploader that loaded another copy of
  `MediaUploadPolicy.ts` applies the app's limits and owner prefix instead of the defaults.
---

# 001 — Media upload policy across copies

Replaces backlog 002. Convention:
[shared state and error brands](https://github.com/linked-fw/cli/blob/main/docs/architecture/shared-state-and-error-brands.md)
([linked-fw/cli report 020](https://github.com/linked-fw/cli/blob/main/docs/reports/020-shared-state-and-error-brands.md)).

## Problem

`src/utils/MediaUploadPolicy.ts` kept the caller-set policy in a module-level `let configured`.
`configureMediaUploads()` (app configuration) wrote it and `getMediaUploadPolicy()` (read by
`ImageObjectProvider`, `VideoObjectProvider` and `requireMediaCaller`) read it. When the module is
evaluated twice in one runtime (Vite's SSR runner and Node under `linked start`, or two bundles),
an uploader that reached the other copy saw an empty policy: the environment variables and the
default limits (10 MiB images, 200 MiB video) and the default owner prefix applied instead of
what the app configured.

This was the only must-share value the survey found in this package; its term definitions are
constants.

## Change

- The policy is kept in one container,
  `sharedState('@_linked/schema', 'MediaUploadPolicy', () => ({ configured: {} }))`, i.e.
  `globalThis[Symbol.for('@_linked/schema:MediaUploadPolicy')]`. `configureMediaUploads()` replaces
  `state.configured`; `getMediaUploadPolicy()` reads it (with `?? {}` so a container made by a
  different layout never throws).
- Public API unchanged: `configureMediaUploads`, `getMediaUploadPolicy`, `MediaUploadPolicy`,
  the defaults and the path helpers keep their signatures and behaviour. Fallback order is still
  configured value, then `LINKED_MAX_IMAGE_UPLOAD_BYTES` / `LINKED_MAX_VIDEO_UPLOAD_BYTES`, then
  the defaults; `configureMediaUploads()` with no argument still resets.
- `@_linked/core` raised to `^2.36.0` (the first release with `sharedState`); the lockfile already
  resolved 2.36.1.

## Tests

- New `tests/media-policy-shared.test.mjs` imports the built `lib/esm/utils/MediaUploadPolicy.js`
  twice (the second with a `?copy` query) and checks: the copies are distinct; limits and
  `ownerPrefix` set through one copy apply in the other (including `requireMediaCaller`'s prefix);
  a reset through either copy resets both; the state is under the documented `Symbol.for` key.
  Against the previous code 3 of its 4 tests fail.
- Full suite (`npx linked build && npm test`): 96 tests, 96 pass (`media-provider-access`,
  `shape-names`, `media-policy-shared`).

## Follow-ups

- The cli architecture doc's package table lists schema as "schema backlog 002"; it can be marked
  done there when that doc is next updated.
