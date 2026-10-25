# @\_linked/schema

## 1.9.1

### Patch Changes

- [#90](https://github.com/linked-fw/schema/pull/90) [`7906a19`](https://github.com/linked-fw/schema/commit/7906a19f752664618c702995d2274d185fd6d438) Thanks [@flyon](https://github.com/flyon)! - License: MIT (data under its original license)

## 1.9.0

### Minor Changes

- [#88](https://github.com/linked-fw/schema/pull/88) [`4f915be`](https://github.com/linked-fw/schema/commit/4f915bedf21cfb2e7136880b8a5be12f230e0bcc) Thanks [@flyon](https://github.com/flyon)! - Adds a `Dataset` shape for `schema:Dataset`. It extends `CreativeWork` and adds no properties of its own, so a package whose dataset class is `rdfs:subClassOf schema:Dataset` can extend it.

## 1.8.2

### Patch Changes

- [#86](https://github.com/linked-fw/schema/pull/86) [`703dbba`](https://github.com/linked-fw/schema/commit/703dbba8ad21b69d545c4c9a181c2af27854c8ad) Thanks [@flyon](https://github.com/flyon)! - license: MIT; data license noted

## 1.8.1

### Patch Changes

- [#84](https://github.com/linked-fw/schema/pull/84) [`6aab6ba`](https://github.com/linked-fw/schema/commit/6aab6ba96fb5d1be4739cab89d30e8448d463466) Thanks [@flyon](https://github.com/flyon)! - README links core's "Using ontology terms" (namespace imports, accessors over `{id}`). No code changed.

## 1.8.0

### Minor Changes

- [#82](https://github.com/linked-fw/schema/pull/82) [`b12189e`](https://github.com/linked-fw/schema/commit/b12189e4d91451a0b01e015bb2da3b98a8c3442b) Thanks [@flyon](https://github.com/flyon)! - `src/data/schema.ttl` is schema.org's latest release, version 30.1
  (`https://schema.org/version/30.1/schemaorg-current-https.nt`, written by
  `scripts/write-turtle.mjs`), with a comment naming the source; it was an older release converted
  from the package's former JSON-LD. `schema-added.ttl` holds only the ontology entity, now with
  the source and version. The README records the source and the `-added` convention.
  
  - `ontologies/schema` has 3,023 terms (was 2,802): 224 added, among them `Certification`,
    `Credential`, `MemberProgram`, `ProductReturnPolicy`, `ShippingService`, `StatisticalVariable`,
    `ConstraintNode`, `TextObject`, `OperatingSystem`, `PoliticalParty`.
  - **Removed** (schema.org dropped them): `schema.constrainingProperty`, `schema.measuredValue`,
    `schema.observedNode` (30.1 has `constraintProperty` on `ConstraintNode`/`StatisticalVariable`). Nothing in this
    package used them.
  - No new renames beyond `_3DModel` and `yield_`.
  - Class hierarchy changes for existing classes: `DonateAction` ⊂ `TransferAction` (was
    `TradeAction`); `EducationalOccupationalCredential` ⊂ `Credential` (was `CreativeWork`; `Credential`
    ⊂ `CreativeWork`); `OrderItem` ⊂ `StructuredValue` (was `Intangible`); `PaymentMethod` ⊂
    `Intangible` (was `Enumeration`); `Quantity` is now only a `schema:DataType` (was ⊂
    `Intangible`); `Observation` ⊂ `QuantitativeValue`; `DefinedRegion` ⊂ `Place`; `Drug`,
    `DietarySupplement` ⊂ `Product`; `PaymentService` also ⊂ `PaymentMethod`; external superclasses
    (FIBO, OMG Commons) on `Brand`, `Country`, `DigitalDocument`, `Invoice`, `Order`, `ProductGroup`,
    `WarrantyPromise`. Apps sync the hierarchy into every dataset, so `sh:targetClass` inference follows.

## 1.7.0

### Minor Changes

- [#80](https://github.com/linked-fw/schema/pull/80) [`7cd87fa`](https://github.com/linked-fw/schema/commit/7cd87fa1db5948b6cbe6631a9df5c13e6d5e5724) Thanks [@flyon](https://github.com/flyon)! - The `schema` accessor modules are generated from `src/data/schema.ttl` and `schema-added.ttl` by
  `linked generate-ontology` (`package.json` `"linkedOntologies"`), and `linked build` fails when
  they are stale. `ontologies/schema` exports one named term for each of schema.org's 2,802
  subjects (up from 132), each `/*#__PURE__*/`, so a bundler keeps only the terms used. The README
  explains the namespace import.
  
  Breaking changes:
  
  - The aggregated `schema` object is gone. Import the module as a namespace:
  
    ```ts
    import * as schema from '@_linked/schema/ontologies/schema';
    static targetClass = schema.Person;
    ```
  
  - `ns`, `dataFiles`, `loadData` and `_ontologyResource` moved to
    `@_linked/schema/ontologies/schema.data`; `import * as schema` no longer reaches them, and the
    registered ontology carries only its terms.
  - Terms whose local name is not an identifier, new in this release: `schema:3DModel` →
    `_3DModel`, `schema:yield` → `yield_`. No previously exported name changed.
  - The shapes import `@_linked/xsd` 1.4's namespace module. Requires `@_linked/core` ^2.41.0 and
    `@_linked/xsd` ^1.4.0.

## 1.6.1

### Patch Changes

- [#78](https://github.com/linked-fw/schema/pull/78) [`3cdba37`](https://github.com/linked-fw/schema/commit/3cdba3777e176bdc64c1d511973f2dbbcb99a49d) Thanks [@flyon](https://github.com/flyon)! - Ships `lib/esm/data/shapes.ttl`; core range raised.

## 1.6.0

### Minor Changes

- [#76](https://github.com/linked-fw/schema/pull/76) [`57fc01d`](https://github.com/linked-fw/schema/commit/57fc01d5c6d12bd74d9293c533a7fbf1554af78c) Thanks [@flyon](https://github.com/flyon)! - Ontology data is Turtle, the shapes follow schema.org's class hierarchy, and the package holds only schema.org's terms. Needs `@_linked/core` with `loadOntologyFiles` and the shape check, and a build that copies `src/**/*.ttl` into `lib/`.
  
  **Data.** `src/data/schema.json` and `schema-added.json` are replaced by `schema.ttl` and `schema-added.ttl` (the same triples, plus `schema:observationAbout` from schema.org's current release). `loadData` resolves to the Turtle texts (`string[]`) through core's `loadOntologyFiles`, server side only; the package declares `mirrors: 'http://schema.org/'`. `lib/esm/data/*.json` no longer exist.
  
  **Breaking changes.**
  
  - Removed, not schema.org terms: the `ArtBlock` shape (`@_linked/schema/shapes/ArtBlock`), `Person.isMarried`, `Comment.childItem` and `Comment.childItems`, and the terms `schema.isMarried`, `schema.childItem`, `schema.teamID`.
  - `PostalAddress` targets `schema:PostalAddress` (was `schema:Thing`) and extends `Intangible`; `DataFeedItem` targets `schema:DataFeedItem` (was `schema:CreativeWork`). Stored nodes typed with the old class are no longer selected by these shapes. The terms `schema.PostalAddress` and `schema.DataFeedItem` are new.
  - New `extends`, with what each shape now inherits:
    - `Comment` (and so `Answer`) and `Conversation` extend `CreativeWork` (were `Thing`): they gain `creator`, `creditText`, `usageInfo`, `copyrightNotice`, `text`, `dateCreated`, `dateModified`, `headline`, and are `instanceof CreativeWork`.
    - `ListItem`, `ItemList`, `PropertyValue` extend `Intangible` (were `Shape`): they gain Thing's `name`, `alternateName`, `description`, `disambiguatingDescription`, `identifier`, owned `image` (a delete of the node deletes its image), `mainEntityOfPage`, `sameAs`, `subjectOf`, `url`, `additionalType`. `Observation` extends `Intangible` (was `Thing`).
    - `Country` extends `AdministrativeArea` (was `Place`).
    - `BefriendAction` and `JoinAction` extend `Action` (were `Shape`): they gain Thing's properties and Action's, including `agent` with `minCount: 1` and an `xsd:integer` `actionStatus`.
  - `Action.participant` is a `ShapeSet<Person>` without `maxCount` (was a single `Person`).
  - `Action.objects` (multi-valued) is replaced by `Action.object`, a single `Thing` (`maxCount: 1`): schema.org describes `object` as "the object upon which the action is carried out".
  - `JoinAction` drops its own `agents`: the joiner is `agent`, others joining with them are `participant`.
  - `BefriendAction` drops its own `actionStatus`, `agent` and `object` (a `Person`) and uses Action's; `object` is typed `Thing`.
  
  The rules behind these changes, including how a property's cardinality is decided, are in `docs/vocabulary-rules.md`.

## 1.5.3

### Patch Changes

- [#73](https://github.com/linked-fw/schema/pull/73) [`b77d570`](https://github.com/linked-fw/schema/commit/b77d5708565934980f47f63259ffaed965aacd35) Thanks [@flyon](https://github.com/flyon)! - The media upload policy set with `configureMediaUploads()` is now kept on `globalThis` (core's `sharedState`, key `Symbol.for('@_linked/schema:MediaUploadPolicy')`), so an image or video upload handled by a second copy of the module applies the configured size limits and `ownerPrefix` instead of the defaults. The API is unchanged. Requires `@_linked/core` 2.36.0 or later.

## 1.5.2

### Patch Changes

- [#71](https://github.com/linked-fw/schema/pull/71) [`84f17d7`](https://github.com/linked-fw/schema/commit/84f17d7f041bed20ad0823b22d38bb36573525c3) Thanks [@flyon](https://github.com/flyon)! - Provider methods that need a session are declared `@callable('signed-in')` instead of the deprecated alias `'user'`. No behaviour change. Requires `@_linked/server-utils` ^1.14.0.

## 1.5.1

### Patch Changes

- [#67](https://github.com/linked-fw/schema/pull/67) [`528d39e`](https://github.com/linked-fw/schema/commit/528d39ef49708cbfa3696d59259ddc26e7ffa7ff) Thanks [@flyon](https://github.com/flyon)! - Every shape now passes an explicit `name` to `@linkedShape`, equal to its class name, so shape IRIs no longer depend on `constructor.name`.
  
  Each shape shares its name with the ontology term it targets (`Person` and `schema.Person`). When both land in one bundled chunk, the bundler renames the class to keep the bindings apart, and the IRI followed it: a Vite-prebundled browser chunk registered `https://linked.cm/shape/schema/Person3`, and the server answered "Cannot resolve shape". The IRIs are unchanged; they just no longer move when a bundler renames a class.

## 1.5.0

### Minor Changes

- [#64](https://github.com/linked-fw/schema/pull/64) [`b237274`](https://github.com/linked-fw/schema/commit/b23727405bb7c6ed2fd098d05fbc90f0f02a8d69) Thanks [@flyon](https://github.com/flyon)! - Depend on `@_linked/react@^2.0.0` (was `^1.1.0`), `@_linked/primitives@^1.8.0` (was `^1.0`, the first primitives release on `@_linked/react` 2) and `@_linked/core@^2.27.0` (was `^2.22.8`, the core peer range `@_linked/react` 2 requires).
  
  An app on `@_linked/react` 2 no longer installs a second copy of `@_linked/react` 1 through this package or through the primitives it pulls in. The APIs used from it — `createLinkedComponentFn`, `useStyles` and `cl` — did not change in 2.0.
  
  Minor rather than major: `@_linked/react` is a regular dependency here, not a peer, so no consumer has to change anything to install this release; and a major would force every package that depends on `@_linked/schema@^1` (sioc, auth, shape-ui and apps) to change its range just to pick it up.

## 1.4.3

### Patch Changes

- [#62](https://github.com/linked-fw/schema/pull/62) [`8545f54`](https://github.com/linked-fw/schema/commit/8545f546e50240534e68330d944cbc8853839181) Thanks [@flyon](https://github.com/flyon)! - The `build` script is now `linked build`, the same build CI and the release workflow already run, so a local build produces the published `lib/` (compiled output, copied `src` assets and rewritten ESM import specifiers). The `build-esm` and `copy-to-lib` scripts and the `rimraf`/`copyfiles` dev dependencies are removed.

## 1.4.2

### Patch Changes

- [#60](https://github.com/linked-fw/schema/pull/60) [`dc087fe`](https://github.com/linked-fw/schema/commit/dc087fe21c6b5e549878a780da4b8b6156624134) Thanks [@flyon](https://github.com/flyon)! - typescript is no longer installed into consumers: it was listed as a runtime dependency, but the package only needs the compiler to build, so it moved to devDependencies.
  
  Declares its React peer; accepts React 18 or 19. The components import `react`, which is now a `peerDependencies` entry (`^18.2.0 || ^19.0.0`) so the consumer's single React copy is used.

## 1.4.1

### Patch Changes

- [#57](https://github.com/linked-fw/schema/pull/57) [`c5ca3c3`](https://github.com/linked-fw/schema/commit/c5ca3c3e28cc0c1287d26434bc5d70b686834a56) Thanks [@flyon](https://github.com/flyon)! - Publish only the files consumers need; the tarball no longer includes `.changeset/`, `.gitattributes`, `.github/`, `docs/`, `renovate.json` or tsconfig files.

## 1.4.0

### Minor Changes

- [#53](https://github.com/linked-fw/schema/pull/53) [`49a375e`](https://github.com/linked-fw/schema/commit/49a375ee0ecb7f9953535a78dbff1fa0001cfcbe) Thanks [@flyon](https://github.com/flyon)! - Image uploads accept SVG again. `ImageObject.fromFormFile` and `fromDataURL` (declared `image/svg+xml`) accept a file whose content is an SVG document, recognised from its bytes: after an optional UTF-8 byte order mark, an optional XML declaration, and any comments, processing instructions or an `svg` doctype (without an internal subset), the root element must be `<svg>`. It must be named with `.svg` and is stored as `image/svg+xml`. HTML is still refused, as is an SVG under any other extension. This relies on `/uploads` being served with `X-Content-Type-Options: nosniff` and `Content-Security-Policy: sandbox` (as `@_linked/server` does), which keeps script inside an SVG from running.

## 1.3.0

### Minor Changes

- [#51](https://github.com/linked-fw/schema/pull/51) [`cd39311`](https://github.com/linked-fw/schema/commit/cd393119be51f0592f42278e3ba34d1aa858ba32) Thanks [@flyon](https://github.com/flyon)! - Declare the client-called media methods with `@callable('user')` (`ImageObjectProvider.deleteFile`, `getAllFilestoreImages`, `fromDataURL`, `fromFormFile`; `VideoObjectProvider.fromFormFile`), so a server that enforces declared-callable methods keeps dispatching them and answers 401 without a session. Requires `@_linked/server-utils` `^1.9.0`.

- [#51](https://github.com/linked-fw/schema/pull/51) [`cd39311`](https://github.com/linked-fw/schema/commit/cd393119be51f0592f42278e3ba34d1aa858ba32) Thanks [@flyon](https://github.com/flyon)! - The `ImageObjectProvider` and `VideoObjectProvider` file methods require a session, cap upload sizes, and keep each caller's files in a folder of their own.
  
  **Behaviour change — files are stored per user.** Each signed-in caller owns a store folder (`users/<sha256 of the account id>` by default, configurable with `ownerPrefix`). Uploads are written under it, `getAllFilestoreImages` lists only it, and `deleteFile` only deletes inside it. Files uploaded with an earlier version are not under any user's folder: they no longer appear in `getAllFilestoreImages` and **can no longer be deleted over RPC** (`deleteFile` answers 404). Remove or move them on the server if needed. The client's `filePath` is now relative to the caller's folder, so use the returned `contentUrl` rather than building a URL from `filePath`.
  
  - `fromDataURL`, `fromFormFile`, `deleteFile` and `getAllFilestoreImages` answer 401 without a session.
  - `deleteFile` takes a key or a returned URL inside the caller's folder, and answers 404 for anything else.
  - Paths with `..` or `.` segments, empty segments, backslashes, control characters, or a leading `/` or drive letter are rejected with 400.
  - Uploads are capped at 10 MiB for images and 200 MiB for video, and answer 413 above that. Override with `LINKED_MAX_IMAGE_UPLOAD_BYTES` / `LINKED_MAX_VIDEO_UPLOAD_BYTES` or `configureMediaUploads()` from `@_linked/schema/utils/MediaUploadPolicy`, which also accepts an `ownerPrefix` function.
  - `fromDataURL` uses a default file name when no `filePath` is given.
  - `fromFormFile` accepts one file, uses the uploaded file name when no `filePath` is sent, and removes the temporary upload file afterwards.

- [#51](https://github.com/linked-fw/schema/pull/51) [`cd39311`](https://github.com/linked-fw/schema/commit/cd393119be51f0592f42278e3ba34d1aa858ba32) Thanks [@flyon](https://github.com/flyon)! - The media upload methods accept a fixed set of file types, recognised from the file's content.
  
  - Images (`fromDataURL`, `ImageObjectProvider.fromFormFile`): PNG, JPEG, GIF, WebP and AVIF. Video (`VideoObjectProvider.fromFormFile`): MP4, WebM and QuickTime. Anything else, including SVG and HTML, answers 415.
  - `fromDataURL` accepts `data:image/png`, `image/jpeg` (or `image/jpg`), `image/gif`, `image/webp` and `image/avif` URLs, and the decoded bytes must be of the declared type (415 otherwise). BMP, TIFF, HEIF and HEIC data URLs are no longer accepted.
  - `fromFormFile` determines the type from the uploaded bytes and ignores the type the client sends. The file is stored with that type.
  - The stored file name must end in an extension of the recognised type (`.png`; `.jpg` or `.jpeg`; `.gif`; `.webp`; `.avif`; `.mp4`; `.webm`; `.mov`, in any case), and answers 400 otherwise. Without a `filePath` or upload name the file is named after its type, for example `image.png` or `upload.mp4`.
  - The type checks live in `@_linked/schema/utils/MediaTypes` (`detectImageType`, `detectVideoType`, `requireMediaType`, `requireExtensionFor`).

## 1.2.5

### Patch Changes

- [#48](https://github.com/linked-fw/schema/pull/48) [`0abc289`](https://github.com/linked-fw/schema/commit/0abc289ed6c78e36e6c369bc1d505eacb6343925) Thanks [@flyon](https://github.com/flyon)! - Drop the unused `usehooks-ts` dependency. Nothing in the package imports it, and its 2.x peer range
  (`react ^16.8.0 || ^17 || ^18`) excludes React 19, so apps on React 19 got a nested copy installed
  under `@_linked/schema` and a `linked doctor` warning for it.

## 1.2.4

### Patch Changes

- [#43](https://github.com/linked-fw/schema/pull/43) [`d07999b`](https://github.com/linked-fw/schema/commit/d07999bf08f7f2e215e39dbf10101a3617da0700) Thanks [@flyon](https://github.com/flyon)! - Add `shapes/index`, a side-effect-only module that registers every shape this package defines and nothing else (no components, no CSS), so `import '@_linked/schema/shapes/index'` loads the shapes in plain node as well as in a bundle. The package entry now imports it instead of listing shapes one by one.

## 1.2.3

### Patch Changes

- [#41](https://github.com/linked-fw/schema/pull/41) [`70d0f17`](https://github.com/linked-fw/schema/commit/70d0f17cb2b7e70c5b228352c5c10900be391ec2) Thanks [@flyon](https://github.com/flyon)! - Loading any public shape module now registers every shape reachable through its properties, transitively. Since 1.2.2, loading a Thing subclass outside the CreativeWork chain on its own (Place, Answer, Accommodation and 12 more) left Person unregistered, so a query such as `x.image.creator.name` threw "Shape class not found for …/schema/Person". Public import paths and exports are unchanged.

## 1.2.2

### Patch Changes

- [#39](https://github.com/linked-fw/schema/pull/39) [`a86d59d`](https://github.com/linked-fw/schema/commit/a86d59db6f1bf7bc61d728d7780bab320367ac16) Thanks [@flyon](https://github.com/flyon)! - Loading a shape now registers the shapes its properties name.

  `Thing.image` names ImageObject by `['@_linked/schema', 'ImageObject']` because
  ImageObject extends Thing and cannot be imported from Thing's module. A shape
  registers only when its module is evaluated, so an app that imported
  `@_linked/schema/shapes/Thing` (or any subclass) without also loading ImageObject
  threw `Shape class not found for …/schema/ImageObject` from any query traversing
  `.image` — in a production bundle this surfaced as an empty result, not an error.
  `CreativeWork.creator` → Person and `ItemList.itemListElements` → ListItem had the
  same gap.

  Thing, CreativeWork, MediaObject and ImageObject now live in `*.class.ts` modules;
  the public `shapes/<Name>` modules re-export them and import the named shapes, and
  the ancestor chain imports only the `.class` modules, so no import cycle can reach an
  uninitialised `extends`. Public paths and exports are unchanged. Person names
  DefinedTerm instead of referencing it, for the same reason.

## 1.2.1

### Patch Changes

- [#31](https://github.com/linked-fw/schema/pull/31) [`8200c1a`](https://github.com/linked-fw/schema/commit/8200c1af4d92a68a9f7713720d8825841646f9e5) Thanks [@flyon](https://github.com/flyon)! - Sourcemaps now embed their TypeScript source, so consumers no longer see 'points to missing source files' warnings.

## 1.2.0

### Minor Changes

- [#28](https://github.com/linked-fw/schema/pull/28) [`4992446`](https://github.com/linked-fw/schema/commit/499244620d9a04a533273f161f616c51177ba849) Thanks [@flyon](https://github.com/flyon)! - Require `@_linked/core@^2.22.8` (was `^2.0.1`), and pin it in the lockfile.

  The declared range was wide enough that the resolved core depended on whatever the
  consumer — or this repo's own CI, via `package-lock.json` — happened to install. Core
  decides how a shape's IRI is minted, so a stale core made this package emit legacy
  `data.lincd.org` IRIs instead of the arch-02 `linked.cm` scheme. Which IRIs a published
  package produces should not be a function of the installer's dependency tree.

  Minor rather than patch: this raises the minimum core a consumer must resolve, so it
  changes what gets installed rather than only what this package does internally.

## 1.1.6

### Patch Changes

- [#26](https://github.com/linked-fw/schema/pull/26) [`4768ca0`](https://github.com/linked-fw/schema/commit/4768ca02274e66a1c22943f991b50fbe3c57a23f) Thanks [@flyon](https://github.com/flyon)! - Drop the unused `lincd-mui-base` dependency.

  `ImageUploader.tsx` imported `Button` but never rendered it, so `tsc` already elided
  the import from the emitted `lib/esm/components/ImageUploader.js`. Removing the
  declaration therefore changes no API and no runtime behaviour — it only stops the
  legacy `lincd` tree from being pulled into the install graph of every consumer of
  `@_linked/schema`, which was the last dependency keeping it alive.

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
