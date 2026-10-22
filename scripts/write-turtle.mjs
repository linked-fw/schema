#!/usr/bin/env node
/**
 * Writes RDF as deterministic Turtle: a fixed prefix block, subjects sorted, `a` first, the other
 * predicates sorted, one predicate per line, objects sorted. The same triples always give the same
 * bytes, so a refresh of `src/data/schema.ttl` diffs only what schema.org changed.
 *
 *   cat schemaorg-current-http.nt | node scripts/write-turtle.mjs > src/data/schema.ttl
 *
 * Reads N-Triples (or N-Quads in the default graph) from stdin and needs no dependency. Blank
 * nodes and named graphs are refused: ontology data names every node and lives in the default
 * graph.
 * `https://schema.org/` IRIs are rewritten to `http://schema.org/`, the namespace this package
 * uses, except as objects of `schema:isPartOf` (schema.org's section hosts, kept as published).
 */
const PREFIXES = [
  ['schema', 'http://schema.org/'],
  ['rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'],
  ['rdfs', 'http://www.w3.org/2000/01/rdf-schema#'],
  ['owl', 'http://www.w3.org/2002/07/owl#'],
  ['xsd', 'http://www.w3.org/2001/XMLSchema#'],
  ['dc', 'http://purl.org/dc/elements/1.1/'],
  ['dcterms', 'http://purl.org/dc/terms/'],
  ['skos', 'http://www.w3.org/2004/02/skos/core#'],
  ['vann', 'http://purl.org/vocab/vann/'],
];
const RDF_TYPE = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const IS_PART_OF = 'http://schema.org/isPartOf';
const XSD_STRING = 'http://www.w3.org/2001/XMLSchema#string';
const LOCAL = /^[A-Za-z0-9_](?:[A-Za-z0-9_-]*)$/;

const toHttp = (iri) => iri.replace(/^https:\/\/schema\.org\//, 'http://schema.org/');

const iri = (value) => {
  for (const [prefix, ns] of PREFIXES) {
    if (value.startsWith(ns)) {
      const local = value.slice(ns.length);
      if (local === '' || LOCAL.test(local)) return `${prefix}:${local}`;
    }
  }
  return `<${value.replace(/[\x00-\x20<>"{}|^`\\]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`)}>`;
};

const string = (value) =>
  '"' +
  value.replace(/[\\"\n\r\t]/g, (c) => ({'\\': '\\\\', '"': '\\"', '\n': '\\n', '\r': '\\r', '\t': '\\t'})[c]) +
  '"';

const UNESCAPE = {t: '\t', b: '\b', n: '\n', r: '\r', f: '\f', '"': '"', "'": "'", '\\': '\\'};
const unescape = (value) =>
  value.replace(/\\(?:u([0-9A-Fa-f]{4})|U([0-9A-Fa-f]{8})|(.))/g, (_, u, U, c) =>
    u || U ? String.fromCodePoint(parseInt(u || U, 16)) : UNESCAPE[c],
  );

/** One N-Triples term at `rest`'s start: [term, rest after it]. */
const IRI_TERM = /^<([^>]*)>\s*/;
const LITERAL_TERM = /^"((?:[^"\\]|\\.)*)"(?:@([A-Za-z0-9-]+)|\^\^<([^>]*)>)?\s*/;
const readTerm = (rest, line) => {
  let m = IRI_TERM.exec(rest);
  if (m) return [{iri: unescape(m[1])}, rest.slice(m[0].length)];
  m = LITERAL_TERM.exec(rest);
  if (m) return [{value: unescape(m[1]), language: m[2], datatype: m[3] && unescape(m[3])}, rest.slice(m[0].length)];
  throw new Error(`line ${line}: expected an IRI or a literal (ontology data has no blank nodes): ${rest.slice(0, 80)}`);
};

const literal = (t) => {
  if (t.language) return `${string(t.value)}@${t.language}`;
  if (t.datatype && t.datatype !== XSD_STRING) return `${string(t.value)}^^${iri(t.datatype)}`;
  return string(t.value);
};

const chunks = [];
for await (const chunk of process.stdin) chunks.push(chunk);
const input = Buffer.concat(chunks).toString('utf8');

/** subject → predicate → set of serialized objects */
const subjects = new Map();
input.split(/\r?\n/).forEach((text, i) => {
  const line = text.trim();
  if (!line || line.startsWith('#')) return;
  const [subject, afterSubject] = readTerm(line, i + 1);
  const [predicate, afterPredicate] = readTerm(afterSubject, i + 1);
  const [object, afterObject] = readTerm(afterPredicate, i + 1);
  if (afterObject !== '.') throw new Error(`line ${i + 1}: a named graph or trailing text: ${afterObject}`);
  if (!subject.iri || !predicate.iri) throw new Error(`line ${i + 1}: subject and predicate must be IRIs`);
  const s = toHttp(subject.iri);
  const p = toHttp(predicate.iri);
  const o = object.iri ? iri(p === IS_PART_OF ? object.iri : toHttp(object.iri)) : literal(object);
  if (!subjects.has(s)) subjects.set(s, new Map());
  const preds = subjects.get(s);
  if (!preds.has(p)) preds.set(p, new Set());
  preds.get(p).add(o);
});

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const out = PREFIXES.map(([p, ns]) => `@prefix ${p}: <${ns}> .`);
for (const s of [...subjects.keys()].sort(cmp)) {
  const preds = subjects.get(s);
  const order = [...preds.keys()].sort((a, b) => (a === RDF_TYPE ? -1 : b === RDF_TYPE ? 1 : cmp(a, b)));
  const lines = order.map((p) => `    ${p === RDF_TYPE ? 'a' : iri(p)} ${[...preds.get(p)].sort(cmp).join(', ')}`);
  out.push('', `${iri(s)}\n${lines.join(' ;\n')} .`);
}
process.stdout.write(out.join('\n') + '\n');
