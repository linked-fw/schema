// Runs against the built lib: `npx linked build && npm test`.
//
// A shape's IRI is `<baseUri>shape/schema/<name>`, and `Server.call` routes on it.
// Without an explicit `name`, `@linkedShape` takes it from `constructor.name`,
// which a bundler renames whenever another binding in the chunk shares it — and
// every shape here shares its name with the ontology term it targets
// (`var Person = term("Person")`), so a prebundled browser chunk produced
// `.../shape/schema/Person3`. These tests keep every shape on an explicit name.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { getNodeShapeUri } from '@_linked/core/shapes/SHACL';
import '../lib/esm/shapes/index.js';
import { getPackageShape, packageName } from '../lib/esm/package.js';

const SRC = fileURLToPath(new URL('../src', import.meta.url));
const DECORATED_CLASS =
  /@linkedShape\(([\s\S]*?)\)\s*\n\s*(?:export\s+)?(?:abstract\s+)?class\s+(\w+)/g;

function sourceFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

// Every `@linkedShape(...)` in src, with the class it decorates and the
// explicit name it passes (undefined when it passes none).
const decorated = sourceFiles(SRC).flatMap((file) => {
  const source = readFileSync(file, 'utf8');
  return [...source.matchAll(DECORATED_CLASS)].map(([, options, className]) => ({
    file: file.slice(SRC.length + 1),
    className,
    name: /\bname:\s*['"]([^'"]+)['"]/.exec(options)?.[1],
  }));
});

describe('shape names', () => {
  it('finds the decorated shapes in src', () => {
    assert.ok(decorated.length > 30, `found only ${decorated.length} shapes`);
    const decoratorCount = sourceFiles(SRC)
      .map((file) => readFileSync(file, 'utf8').match(/@linkedShape\b/g)?.length ?? 0)
      .reduce((a, b) => a + b, 0);
    assert.equal(decorated.length, decoratorCount, 'a @linkedShape the scan did not parse');
  });

  it('every @linkedShape passes an explicit name equal to its class name', () => {
    const wrong = decorated
      .filter(({ className, name }) => name !== className)
      .map(({ file, className, name }) => `${file}: class ${className} has name ${name}`);
    assert.deepEqual(wrong, []);
  });

  it('every shape registers under the IRI of its explicit name', () => {
    for (const { className, name } of decorated) {
      const shapeClass = getPackageShape(name);
      assert.ok(shapeClass, `no shape registered as ${name}`);
      assert.equal(shapeClass.shape.id, getNodeShapeUri(packageName, className));
      assert.equal(shapeClass.shape.label, className);
    }
  });
});
