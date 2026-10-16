---
'@_linked/schema': patch
---

Every shape now passes an explicit `name` to `@linkedShape`, equal to its class name, so shape IRIs no longer depend on `constructor.name`.

Each shape shares its name with the ontology term it targets (`Person` and `schema.Person`). When both land in one bundled chunk, the bundler renames the class to keep the bindings apart, and the IRI followed it: a Vite-prebundled browser chunk registered `https://linked.cm/shape/schema/Person3`, and the server answered "Cannot resolve shape". The IRIs are unchanged; they just no longer move when a bundler renames a class.
