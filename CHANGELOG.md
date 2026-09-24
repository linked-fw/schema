# @\_linked/schema

## 1.1.5

### Patch Changes

- [#23](https://github.com/linked-fw/schema/pull/23) [`b258ff3`](https://github.com/linked-fw/schema/commit/b258ff3361f349fc90b5c5ce035aea1cfcb762e1) Thanks [@flyon](https://github.com/flyon)! - The ontology no longer registers by importing itself.

  It carried `import * as _this from './<prefix>.js'` and passed that namespace to
  `linkedOntology()`. Under `tsc` the self-reference survives; under a bundler it does
  not — Rollup treats it as a circular import and elides it, so the binding is
  `undefined` and a consuming app dies at boot with `_this is not defined`.

  Registration now lives in a `<prefix>.register.ts` sibling, imported from the package
  entry. Nothing changes for consumers: importing this package still registers the
  ontology.

## 1.1.4

### Patch Changes

- [#21](https://github.com/linked-fw/schema/pull/21) [`3972888`](https://github.com/linked-fw/schema/commit/39728886d209c3ee9da9637cca8a1be37683bf12) Thanks [@flyon](https://github.com/flyon)! - Compile the whole `src` folder, and let a bare import resolve under Node10.

  The build only emitted what an entry transitively reached, so any module
  nothing imported was never built — and never type-checked, so it rotted
  quietly. `include` now covers `src/**/*` with tests excluded explicitly.

  `typesVersions` maps every specifier through `lib/esm/*`, so a `types` value
  that already carried that prefix had it applied twice and no consumer on
  classic Node10 resolution could `import` the package by its bare name.

## 1.1.3

### Patch Changes

- [#18](https://github.com/linked-fw/schema/pull/18) [`156c056`](https://github.com/linked-fw/schema/commit/156c0565e68e6d95c6a66881c227773d797d3564) Thanks [@flyon](https://github.com/flyon)! - Declare npm as the package manager for this repo, convert the build scripts off `yarn`, and mark `package-lock.json` as a generated file.

## 1.1.1

### Patch Changes

- [#12](https://github.com/linked-cm/schema/pull/12) [`5eed2da`](https://github.com/linked-cm/schema/commit/5eed2daa30efe104d0922412f9bf1dd30309cf6c) Thanks [@flyon](https://github.com/flyon)! - Export the `schema:author` term. `author` was present in the underlying schema data but missing from the curated term exports; it can now be imported like the other terms:

  ```ts
  import { author, schema } from "@_linked/schema/ontologies/schema";
  // author.id === 'http://schema.org/author'; also available as schema.author
  ```

## 1.1.0

### Minor Changes

- [#10](https://github.com/linked-cm/schema/pull/10) [`5625232`](https://github.com/linked-cm/schema/commit/5625232de4ac7e3691c0b9d37babf59624a7de45) Thanks [@flyon](https://github.com/flyon)! - Published ESM-only (dropped the CJS build) to match the rest of the `@_linked/*` fleet. No CJS `require` consumers remained.

## 1.0.8

### Patch Changes

- [#8](https://github.com/linked-cm/schema/pull/8) [`76c335f`](https://github.com/linked-cm/schema/commit/76c335fd7e8d2464c1816d70197fa96bb9c175f6) Thanks [@flyon](https://github.com/flyon)! - `Thing.image` is now an **owned** (`contains: true`) object property: an entity exclusively owns its `ImageObject`. Combined with core 2.14.1's owned-property cleanup, replacing/removing an entity's image (`update({image: {contentUrl}})`) now cascade-deletes the previous `ImageObject` instead of leaving it orphaned in the graph.

## 1.0.7

### Patch Changes

- [#5](https://github.com/linked-cm/schema/pull/5) [`a8d45e4`](https://github.com/linked-cm/schema/commit/a8d45e4ec930b72aee0921c08924ccb2705c8040) Thanks [@flyon](https://github.com/flyon)! - loadData: ESM-only JSON import — drop the dead CJS branch, add the `{ with: { type: 'json' } }` import attribute.

## 1.0.6

### Patch Changes

- [#2](https://github.com/linked-cm/schema/pull/2) [`c9860d8`](https://github.com/linked-cm/schema/commit/c9860d8e7314e326cf1089227097078b142a824e) Thanks [@flyon](https://github.com/flyon)! - Switch to explicit per-step build pipeline so silent build failures no longer ship empty tarballs. The previous `yarn linked build` wrapper was failing silently in CI and dropping all compiled `.js` files from the published tarball.

## 1.0.5

### Patch Changes

- [`ce693b4`](https://github.com/linked-cm/schema/commit/ce693b4e0be4986a2e152efcc032949852eaf0be) - Initial release under the new publishing setup.
