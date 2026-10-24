---
"@_linked/schema": minor
---

`src/data/schema.ttl` is schema.org's latest release, version 30.1
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
