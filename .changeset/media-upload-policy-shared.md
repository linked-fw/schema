---
'@_linked/schema': patch
---

The media upload policy set with `configureMediaUploads()` is now kept on `globalThis` (core's `sharedState`, key `Symbol.for('@_linked/schema:MediaUploadPolicy')`), so an image or video upload handled by a second copy of the module applies the configured size limits and `ownerPrefix` instead of the defaults. The API is unchanged. Requires `@_linked/core` 2.36.0 or later.
