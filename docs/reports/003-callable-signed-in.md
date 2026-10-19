---
summary: >
  The media providers' session-gated methods are declared @callable('signed-in') instead of the
  deprecated alias 'user' (ImageObjectProvider x4, VideoObjectProvider x1). No behaviour change;
  needs @_linked/server-utils ^1.14.0. Released in 1.5.2.
---

# 003 — Media providers declare 'signed-in'

[#71](https://github.com/linked-fw/schema/pull/71), released in `@_linked/schema` 1.5.2.

## Why

`@_linked/server-utils` 1.14.0 names the level `'signed-in'` and keeps `'user'` as a deprecated
alias. The declarations move to the current name.

## Change

- `src/shapes/ImageObjectProvider.ts`: `deleteFile`, `getAllFilestoreImages`, `fromDataURL`,
  `fromFormFile` are `@callable('signed-in')`.
- `src/shapes/VideoObjectProvider.ts`: `fromFormFile` is `@callable('signed-in')`.
- `@_linked/server-utils` range `^1.9.0` to `^1.14.0`.
- `tests/media-provider-access.test.mjs` expects `'signed-in'`.

Verification at merge: `npm test` 92/92.

## Known limits

The 401 pre-check for `'signed-in'` needs `@_linked/server` 3.5.0 in the app. An older server
still reaches each method's own session check (`requireMediaCaller`), so access is unchanged.

## Follow-ups

None.
