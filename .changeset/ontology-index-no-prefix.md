---
"@_linked/schema": major
---

Ontology modules in the one-index layout, and no prefix registered. `ontologies/schema` holds only the terms, each an `{id}` with its full IRI. `ontologies/index` registers every ontology of the package with core's `registerOntologies` (data and suggested prefix); the package entry and `shapes/index` import it. Removed: the `ontologies/<name>.data` and `ontologies/<name>.register` modules (`ns`, `dataFiles`, `loadData`, `_ontologyResource`) and `linkedOntology` from `package` (now `registerOntologies`). The package no longer adds a prefix: an app lists the prefixes it uses in its own prefix map. For a namespace function use `createNameSpace(namespace)` from `@_linked/core/utils/NameSpace`; for the data, the registration from `getRegisteredOntologies()`. Namespaces, term names and term IRIs are unchanged. Requires the core release with `registerOntologies`.
