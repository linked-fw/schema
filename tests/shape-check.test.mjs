// Runs against the built lib: `npx linked build && npm test`.
//
// The shape check (`@_linked/core/shapes/checkShapeHierarchy`) holds this package to the rules
// every package that mirrors a published standard follows: each shape's `extends` agrees with
// schema.org's class hierarchy in `src/data/schema.ttl`, each shape owns the class it targets,
// and no shape or exported term uses a `schema:` IRI that schema.org does not define. `linked
// build` fails on the same errors once it runs the check; this test keeps the package clean
// until then and names every finding when it is not.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { checkShapeHierarchy } from '@_linked/core/shapes/checkShapeHierarchy';
import '../lib/esm/shapes/index.js';
import { packageName } from '../lib/esm/package.js';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const SCHEMA = 'http://schema.org/';
// Shape IRIs are `<base>shape/schema/<Name>` (see shape-names.test.mjs).
const ownShape = (iri) => typeof iri === 'string' && iri.includes('/shape/schema/');

describe('shape check', () => {
  it("finds nothing in this package's shapes or in the schema.org namespace it mirrors", async () => {
    const findings = await checkShapeHierarchy({
      dependencies: {
        [packageName]: [
          ...Object.keys(manifest.dependencies ?? {}),
          ...Object.keys(manifest.peerDependencies ?? {}),
        ],
      },
    });
    const ours = findings.filter(
      (f) =>
        ownShape(f.shape) ||
        (f.kind === 'mirror-undefined-term' && f.iri?.startsWith(SCHEMA)),
    );
    assert.deepEqual(
      ours.map((f) => `${f.severity} ${f.kind}: ${f.message}`),
      [],
    );
  });
});
