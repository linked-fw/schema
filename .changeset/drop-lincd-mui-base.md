---
'@_linked/schema': patch
---

Drop the unused `lincd-mui-base` dependency.

`ImageUploader.tsx` imported `Button` but never rendered it, so `tsc` already elided
the import from the emitted `lib/esm/components/ImageUploader.js`. Removing the
declaration therefore changes no API and no runtime behaviour — it only stops the
legacy `lincd` tree from being pulled into the install graph of every consumer of
`@_linked/schema`, which was the last dependency keeping it alive.
