// Runs against the built lib: `npx linked build && npm test`.
import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { PassThrough } from 'node:stream';
import { LinkedFileStorage } from '@_linked/core/utils/LinkedFileStorage';
import { runInHttpContext } from '@_linked/server-utils/utils/CallContext';
import { ImageObjectProvider, VideoObjectProvider } from '../lib/esm/backend.js';
import { ImageObject } from '../lib/esm/shapes/ImageObject.js';
import { VideoObject } from '../lib/esm/shapes/VideoObject.js';
import {
  configureMediaUploads,
  defaultOwnerPrefix,
  safeRelativePath,
} from '../lib/esm/utils/MediaUploadPolicy.js';

const ALICE = 'https://example.test/account/alice';
const BOB = 'https://example.test/account/bob';
const ALICE_PREFIX = defaultOwnerPrefix(ALICE);
const BOB_PREFIX = defaultOwnerPrefix(BOB);
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_BYTES = Buffer.concat([PNG_SIGNATURE, Buffer.from('png-bytes')]);
const PNG = 'data:image/png;base64,' + PNG_BYTES.toString('base64');
const MP4_BYTES = Buffer.concat([
  Buffer.from([0, 0, 0, 0x18]),
  Buffer.from('ftypisom'),
  Buffer.from([0, 0, 2, 0]),
  Buffer.from('isomiso2'),
  Buffer.alloc(8, 1),
]);

class MemoryStore {
  constructor() {
    this.files = new Map();
    this.types = new Map();
    this.accessURL = 'https://site.test';
  }
  async saveFile(key, content, contentType) {
    this.files.set(key, content);
    this.types.set(key, contentType);
    return `${this.accessURL}/uploads/${key}`;
  }
  async listFiles(prefix) {
    return [...this.files.keys()].filter((key) => !prefix || key.startsWith(prefix));
  }
  async deleteFile(key) {
    if (!this.files.delete(key)) throw new Error('ENOENT');
  }
  async fileExists(key) {
    return this.files.has(key);
  }
}

let store;
const originalImageCreate = ImageObject.create;
const originalVideoCreate = VideoObject.create;

// A provider whose method calls each run in an HTTP call context for
// `request`, as the server runs a dispatched call: `this.request` reads the
// current call's context, and an assignment outside a call is ignored.
function withRequest(Provider, request) {
  const provider = new Provider(undefined, undefined);
  return new Proxy(provider, {
    get(target, key, receiver) {
      const value = Reflect.get(target, key, receiver);
      if (typeof value !== 'function') return value;
      return (...args) => runInHttpContext(request, {}, () => value.apply(target, args));
    },
  });
}
const session = (accountId) => ({ linkedAuth: { userAccount: { id: accountId } } });
const image = (request = session(ALICE)) => withRequest(ImageObjectProvider, request);

function multipart(fields, file, auth) {
  const boundary = '----media-test-boundary';
  const parts = [];
  for (const [name, value] of Object.entries(fields)) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`,
    );
  }
  if (file) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="upload"; filename="${file.name}"\r\n` +
        `Content-Type: ${file.type}\r\n\r\n`,
    );
  }
  const body = Buffer.concat([
    Buffer.from(parts.join('')),
    file ? Buffer.concat([file.content, Buffer.from('\r\n')]) : Buffer.alloc(0),
    Buffer.from(`--${boundary}--\r\n`),
  ]);
  const request = new PassThrough();
  request.headers = {
    'content-type': `multipart/form-data; boundary=${boundary}`,
    'content-length': String(body.length),
  };
  if (auth) request.linkedAuth = auth;
  request.end(body);
  return request;
}

const rejectsWith = (promise, status) =>
  assert.rejects(promise, (error) => {
    assert.equal(error.name, 'ServerCallError');
    assert.equal(error.status, status, error.message);
    return true;
  });

beforeEach(() => {
  store = new MemoryStore();
  LinkedFileStorage.setDefaultStore(store);
  ImageObject.create = async (data) => data;
  VideoObject.create = async (data) => data;
  configureMediaUploads();
});

afterEach(() => {
  ImageObject.create = originalImageCreate;
  VideoObject.create = originalVideoCreate;
  configureMediaUploads();
});

describe('anonymous callers are rejected with 401', () => {
  for (const [name, call] of [
    ['deleteFile', (p) => p.deleteFile(`${ALICE_PREFIX}/a.png`)],
    ['getAllFilestoreImages', (p) => p.getAllFilestoreImages()],
    ['fromDataURL', (p) => p.fromDataURL(PNG, 'images/a.png')],
    ['ImageObject fromFormFile', (p) => p.fromFormFile()],
  ]) {
    it(name, async () => {
      await rejectsWith(call(image({})), 401);
      assert.equal(store.files.size, 0);
    });
  }
  it('VideoObject fromFormFile', async () => {
    const request = multipart({ filePath: 'v.mp4' }, {
      name: 'v.mp4',
      type: 'video/mp4',
      content: MP4_BYTES,
    });
    await rejectsWith(withRequest(VideoObjectProvider, request).fromFormFile(), 401);
    assert.equal(store.files.size, 0);
  });
});

describe('fromDataURL', () => {
  it('stores the file under the caller prefix and returns its URL', async () => {
    const result = await image().fromDataURL(PNG, 'images/project-x.png', {
      name: 'project-x',
      identifier: 1,
    });
    const key = `${ALICE_PREFIX}/images/project-x.png`;
    assert.deepEqual([...store.files.keys()], [key]);
    assert.equal(result.contentUrl, `https://site.test/uploads/${key}`);
    assert.deepEqual(store.files.get(key), PNG_BYTES);
  });

  for (const filePath of [
    '../escape.png',
    'images/../../escape.png',
    '/etc/passwd',
    'C:/x.png',
    'images\\..\\x.png',
    'images//x.png',
    'images/%2e%2e/x.png',
    'a\u0000.png',
  ]) {
    it(`rejects the path ${JSON.stringify(filePath)}`, async () => {
      await rejectsWith(image().fromDataURL(PNG, filePath), 400);
      assert.equal(store.files.size, 0);
    });
  }

  it('rejects an image over the size cap', async () => {
    configureMediaUploads({ maxImageBytes: 8 });
    await rejectsWith(image().fromDataURL(PNG, 'images/a.png'), 413);
    assert.equal(store.files.size, 0);
  });

  it('rejects non-image data URLs', async () => {
    await rejectsWith(image().fromDataURL('data:text/html;base64,PGI+', 'a.html'), 400);
    await rejectsWith(image().fromDataURL('not a data url', 'a.png'), 400);
  });

  it('defaults the cap to 10 MiB, overridable by environment', async () => {
    const { getMediaUploadPolicy } = await import('../lib/esm/utils/MediaUploadPolicy.js');
    assert.equal(getMediaUploadPolicy().maxImageBytes, 10 * 1024 * 1024);
    assert.equal(getMediaUploadPolicy().maxVideoBytes, 200 * 1024 * 1024);
    process.env.LINKED_MAX_IMAGE_UPLOAD_BYTES = '1234';
    try {
      assert.equal(getMediaUploadPolicy().maxImageBytes, 1234);
    } finally {
      delete process.env.LINKED_MAX_IMAGE_UPLOAD_BYTES;
    }
  });
});

describe('getAllFilestoreImages', () => {
  it('lists only the caller\'s files', async () => {
    store.files.set(`${ALICE_PREFIX}/a.png`, Buffer.from('a'));
    store.files.set(`${BOB_PREFIX}/b.png`, Buffer.from('b'));
    store.files.set('legacy/c.png', Buffer.from('c'));
    const images = await image().getAllFilestoreImages();
    assert.deepEqual(
      [...images].map((entry) => entry.id),
      [`${ALICE_PREFIX}/a.png`],
    );
  });
});

describe('deleteFile', () => {
  it('deletes the caller\'s own file by key or by URL', async () => {
    store.files.set(`${ALICE_PREFIX}/a.png`, Buffer.from('a'));
    store.files.set(`${ALICE_PREFIX}/b.png`, Buffer.from('b'));
    await image().deleteFile(`${ALICE_PREFIX}/a.png`);
    await image().deleteFile(`https://site.test/uploads/${ALICE_PREFIX}/b.png`);
    assert.equal(store.files.size, 0);
  });

  it('answers 404 for another user\'s file and leaves it alone', async () => {
    store.files.set(`${BOB_PREFIX}/b.png`, Buffer.from('b'));
    store.files.set('legacy/c.png', Buffer.from('c'));
    await rejectsWith(image().deleteFile(`${BOB_PREFIX}/b.png`), 404);
    await rejectsWith(image().deleteFile(`https://site.test/uploads/${BOB_PREFIX}/b.png`), 404);
    await rejectsWith(image().deleteFile('legacy/c.png'), 404);
    assert.equal(store.files.size, 2);
  });

  it('rejects traversal out of the caller\'s prefix', async () => {
    store.files.set(`${BOB_PREFIX}/b.png`, Buffer.from('b'));
    await rejectsWith(image().deleteFile(`${ALICE_PREFIX}/../${BOB_PREFIX}/b.png`), 400);
    await rejectsWith(image().deleteFile('/etc/passwd'), 400);
    assert.equal(store.files.size, 1);
  });
});

describe('fromFormFile', () => {
  const png = { name: 'logo.png', type: 'image/png', content: PNG_BYTES };

  it('stores an image under the caller prefix', async () => {
    const request = multipart({ filePath: 'images/logo.png' }, png, session(ALICE).linkedAuth);
    const result = await image(request).fromFormFile();
    const key = `${ALICE_PREFIX}/images/logo.png`;
    assert.deepEqual([...store.files.keys()], [key]);
    assert.equal(result.contentUrl, `https://site.test/uploads/${key}`);
  });

  it('falls back to the uploaded file name', async () => {
    const request = multipart({}, { ...png, name: '../../my logo.png' }, session(ALICE).linkedAuth);
    await image(request).fromFormFile();
    assert.deepEqual([...store.files.keys()], [`${ALICE_PREFIX}/my-logo.png`]);
  });

  it('rejects a traversal filePath', async () => {
    const request = multipart({ filePath: '../../x.png' }, png, session(ALICE).linkedAuth);
    await rejectsWith(image(request).fromFormFile(), 400);
    assert.equal(store.files.size, 0);
  });

  it('rejects an image over the size cap', async () => {
    configureMediaUploads({ maxImageBytes: 4 });
    const request = multipart({ filePath: 'a.png' }, png, session(ALICE).linkedAuth);
    await rejectsWith(image(request).fromFormFile(), 413);
    assert.equal(store.files.size, 0);
  });

  it('applies the video cap to VideoObject uploads', async () => {
    const video = { name: 'v.mp4', type: 'video/mp4', content: MP4_BYTES };
    configureMediaUploads({ maxImageBytes: 4, maxVideoBytes: 64 });
    const ok = multipart({ filePath: 'v.mp4' }, video, session(ALICE).linkedAuth);
    await withRequest(VideoObjectProvider, ok).fromFormFile();
    assert.deepEqual([...store.files.keys()], [`${ALICE_PREFIX}/v.mp4`]);

    configureMediaUploads({ maxVideoBytes: 16 });
    const tooBig = multipart({ filePath: 'w.mp4' }, video, session(ALICE).linkedAuth);
    await rejectsWith(withRequest(VideoObjectProvider, tooBig).fromFormFile(), 413);
    assert.equal(store.files.size, 1);
  });
});

describe('safeRelativePath', () => {
  it('keeps ordinary relative paths', () => {
    assert.equal(safeRelativePath('images/project-x.png'), 'images/project-x.png');
    assert.equal(safeRelativePath('./images/a.png'), 'images/a.png');
  });

  it('honours a configured owner prefix and validates it', async () => {
    configureMediaUploads({ ownerPrefix: () => 'tenants/t1' });
    await image().fromDataURL(PNG, 'a.png');
    assert.deepEqual([...store.files.keys()], ['tenants/t1/a.png']);
    configureMediaUploads({ ownerPrefix: () => '../escape' });
    await rejectsWith(image().fromDataURL(PNG, 'a.png'), 400);
  });
});

describe('RPC declarations', () => {
  it('declares every client-called file method callable for signed-in users', async () => {
    const { getOwnCallableLevel } = await import('@_linked/server-utils/utils/callable');
    for (const method of ['deleteFile', 'getAllFilestoreImages', 'fromDataURL', 'fromFormFile']) {
      assert.equal(getOwnCallableLevel(ImageObjectProvider, method), 'signed-in', `ImageObjectProvider.${method}`);
    }
    assert.equal(getOwnCallableLevel(VideoObjectProvider, 'fromFormFile'), 'signed-in');
  });
});

describe('media types are read from the bytes', () => {
  const ftyp = (major, ...compatible) => {
    const brands = [major, '\0\0\0\0', ...compatible].join('');
    const size = Buffer.alloc(4);
    size.writeUInt32BE(8 + brands.length);
    return Buffer.concat([size, Buffer.from('ftyp' + brands, 'latin1'), Buffer.alloc(16, 1)]);
  };
  const IMAGES = {
    png: { mime: 'image/png', ext: 'png', bytes: PNG_BYTES },
    jpeg: { mime: 'image/jpeg', ext: 'jpg', bytes: Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x10, 0x4a, 0x46]) },
    gif: { mime: 'image/gif', ext: 'gif', bytes: Buffer.from('GIF89a\x01\x00\x01\x00', 'latin1') },
    webp: { mime: 'image/webp', ext: 'webp', bytes: Buffer.from('RIFF\x1a\x00\x00\x00WEBPVP8 ', 'latin1') },
    avif: { mime: 'image/avif', ext: 'avif', bytes: ftyp('avif', 'avif', 'mif1', 'miaf') },
  };
  const VIDEOS = {
    mp4: { mime: 'video/mp4', ext: 'mp4', bytes: MP4_BYTES },
    webm: {
      mime: 'video/webm',
      ext: 'webm',
      bytes: Buffer.concat([
        Buffer.from([0x1a, 0x45, 0xdf, 0xa3, 0x9f, 0x42, 0x82, 0x84]),
        Buffer.from('webm'),
        Buffer.alloc(16, 0),
      ]),
    },
    quicktime: { mime: 'video/quicktime', ext: 'mov', bytes: ftyp('qt  ', 'qt  ') },
  };
  const HTML = Buffer.from('<!doctype html><script>alert(document.cookie)</script>');
  const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
  const dataUrl = (mime, bytes) => `data:${mime};base64,${bytes.toString('base64')}`;
  const formUpload = (Provider, name, content, type = 'image/png', fields = {}) =>
    withRequest(
      Provider,
      multipart(fields, { name, type, content }, session(ALICE).linkedAuth),
    ).fromFormFile();

  for (const [kind, { mime, ext, bytes }] of Object.entries(IMAGES)) {
    it(`fromDataURL accepts a valid ${kind}`, async () => {
      const result = await image().fromDataURL(dataUrl(mime, bytes), `a.${ext}`);
      const key = `${ALICE_PREFIX}/a.${ext}`;
      assert.equal(result.contentUrl, `https://site.test/uploads/${key}`);
      assert.equal(store.types.get(key), mime);
    });

    it(`fromFormFile accepts a valid ${kind} and stores it as ${mime}`, async () => {
      // the declared type is deliberately wrong: it must be ignored
      await formUpload(ImageObjectProvider, `a.${ext}`, bytes, 'text/html');
      assert.equal(store.types.get(`${ALICE_PREFIX}/a.${ext}`), mime);
    });
  }

  for (const [kind, { mime, ext, bytes }] of Object.entries(VIDEOS)) {
    it(`VideoObject fromFormFile accepts a valid ${kind}`, async () => {
      await formUpload(VideoObjectProvider, `v.${ext}`, bytes, 'application/octet-stream');
      assert.equal(store.types.get(`${ALICE_PREFIX}/v.${ext}`), mime);
    });
  }

  it('fromDataURL accepts .jpeg as well as .jpg', async () => {
    await image().fromDataURL(dataUrl('image/jpeg', IMAGES.jpeg.bytes), 'a.jpeg');
    assert.equal(store.files.size, 1);
  });

  it('fromDataURL names the file after the type when no filePath is given', async () => {
    await image().fromDataURL(dataUrl('image/jpeg', IMAGES.jpeg.bytes));
    assert.deepEqual([...store.files.keys()], [`${ALICE_PREFIX}/image.jpg`]);
  });

  it('fromDataURL refuses HTML bytes behind a png data URL', async () => {
    await rejectsWith(image().fromDataURL(dataUrl('image/png', HTML), 'a.png'), 415);
    assert.equal(store.files.size, 0);
  });

  it('fromDataURL refuses bytes of another accepted type than declared', async () => {
    await rejectsWith(image().fromDataURL(dataUrl('image/png', IMAGES.gif.bytes), 'a.png'), 415);
    assert.equal(store.files.size, 0);
  });

  for (const name of ['x.html', 'x.svg', 'x.jpg', 'x.png.html', 'x', 'x.PNG.svg']) {
    it(`fromDataURL refuses a png named ${JSON.stringify(name)}`, async () => {
      await rejectsWith(image().fromDataURL(PNG, name), 400);
      assert.equal(store.files.size, 0);
    });
  }

  it('fromDataURL accepts an upper-case extension of the right type', async () => {
    await image().fromDataURL(PNG, 'X.PNG');
    assert.equal(store.types.get(`${ALICE_PREFIX}/X.PNG`), 'image/png');
  });

  for (const mime of ['image/bmp', 'image/tiff', 'image/x-icon']) {
    it(`fromDataURL refuses the declared type ${mime}`, async () => {
      await rejectsWith(image().fromDataURL(dataUrl(mime, PNG_BYTES), 'a.png'), 415);
    });
  }

  for (const [label, content] of [
    ['HTML', HTML],
    ['unrecognised bytes', Buffer.from('just some text')],
  ]) {
    it(`fromFormFile refuses ${label} declared as image/png`, async () => {
      await rejectsWith(formUpload(ImageObjectProvider, 'x.png', content, 'image/png'), 415);
      assert.equal(store.files.size, 0);
    });

    it(`VideoObject fromFormFile refuses ${label} declared as video/mp4`, async () => {
      await rejectsWith(formUpload(VideoObjectProvider, 'x.mp4', content, 'video/mp4'), 415);
      assert.equal(store.files.size, 0);
    });
  }

  for (const name of ['x.html', 'x.svg', 'x.gif']) {
    it(`fromFormFile refuses a valid png named ${JSON.stringify(name)}`, async () => {
      await rejectsWith(formUpload(ImageObjectProvider, name, PNG_BYTES), 400);
      assert.equal(store.files.size, 0);
    });
  }

  it('fromFormFile checks the extension of filePath, not of the uploaded name', async () => {
    await rejectsWith(
      formUpload(ImageObjectProvider, 'ok.png', PNG_BYTES, 'image/png', { filePath: 'x.html' }),
      400,
    );
    assert.equal(store.files.size, 0);
  });

  it('VideoObject fromFormFile refuses a mismatched extension and still images', async () => {
    await rejectsWith(formUpload(VideoObjectProvider, 'v.mov', MP4_BYTES), 400);
    await rejectsWith(formUpload(VideoObjectProvider, 'v.webm', VIDEOS.quicktime.bytes), 400);
    await rejectsWith(formUpload(VideoObjectProvider, 'v.mp4', IMAGES.avif.bytes), 415);
    await rejectsWith(formUpload(VideoObjectProvider, 'v.mp4', PNG_BYTES), 415);
    assert.equal(store.files.size, 0);
  });

  it('ImageObject fromFormFile refuses video bytes', async () => {
    await rejectsWith(formUpload(ImageObjectProvider, 'v.mp4', MP4_BYTES, 'video/mp4'), 415);
    assert.equal(store.files.size, 0);
  });
  describe('SVG', () => {
    const BOM = Buffer.from([0xef, 0xbb, 0xbf]);
    const accepted = [
      ['a bare root', SVG],
      ['a self-closing root', Buffer.from('<svg/>')],
      ['a BOM and an XML declaration', Buffer.concat([BOM, Buffer.from('<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg"/>')])],
      ['comments and whitespace before the root', Buffer.from('<?xml version="1.0"?>\n<!-- Generator: x -->\n  <!-- <html> -->\n<svg width="1">\n</svg>')],
      ['an svg doctype', Buffer.from('<?xml version="1.0"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg/>')],
      ['a prefixed root', Buffer.from('<svg:svg xmlns:svg="http://www.w3.org/2000/svg"/>')],
    ];
    for (const [label, content] of accepted) {
      it(`fromFormFile accepts ${label} named .svg, stored as image/svg+xml`, async () => {
        await formUpload(ImageObjectProvider, 'a.svg', content, 'text/html');
        assert.equal(store.types.get(`${ALICE_PREFIX}/a.svg`), 'image/svg+xml');
      });
    }

    it('fromDataURL accepts an image/svg+xml data URL named .svg', async () => {
      await image().fromDataURL(dataUrl('image/svg+xml', SVG), 'a.svg');
      assert.equal(store.types.get(`${ALICE_PREFIX}/a.svg`), 'image/svg+xml');
    });

    it('names an SVG without filePath with .svg', async () => {
      await image().fromDataURL(dataUrl('image/svg+xml', SVG));
      assert.deepEqual([...store.files.keys()], [`${ALICE_PREFIX}/image.svg`]);
    });

    for (const name of ['a.png', 'a.html', 'a.svg.html', 'a.xml', 'a']) {
      it(`refuses an SVG named ${JSON.stringify(name)}`, async () => {
        await rejectsWith(formUpload(ImageObjectProvider, name, SVG, 'image/svg+xml'), 400);
        await rejectsWith(image().fromDataURL(dataUrl('image/svg+xml', SVG), name), 400);
        assert.equal(store.files.size, 0);
      });
    }

    const refused = [
      ['HTML', HTML],
      ['an HTML root', Buffer.from('<html><body><svg/></body></html>')],
      ['an HTML doctype before an svg root', Buffer.from('<!DOCTYPE html><svg/>')],
      ['a doctype with an internal subset', Buffer.from('<!DOCTYPE svg [<!ENTITY x "y">]><svg/>')],
      ['text before the root', Buffer.from('hello <svg/>')],
      ['an element named like svg', Buffer.from('<svgfoo/>')],
      ['an unterminated comment', Buffer.from('<!-- <svg/>')],
      ['a script root', Buffer.from('<script>alert(1)</script>')],
    ];
    for (const [label, content] of refused) {
      it(`refuses ${label} named .svg`, async () => {
        await rejectsWith(formUpload(ImageObjectProvider, 'x.svg', content, 'image/svg+xml'), 415);
        await rejectsWith(image().fromDataURL(dataUrl('image/svg+xml', content), 'x.svg'), 415);
        assert.equal(store.files.size, 0);
      });
    }

    it('refuses PNG bytes declared as image/svg+xml', async () => {
      await rejectsWith(image().fromDataURL(dataUrl('image/svg+xml', PNG_BYTES), 'a.svg'), 415);
    });

    it('VideoObject refuses an SVG', async () => {
      await rejectsWith(formUpload(VideoObjectProvider, 'v.mp4', SVG, 'video/mp4'), 415);
    });
  });
});
