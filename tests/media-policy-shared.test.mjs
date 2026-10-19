// Runs against the built lib: `npx linked build && npm test`.
// A second copy of the module (the built file imported again with a `?copy`
// query) must see the policy the first copy was configured with.
import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

const modulePath = '../lib/esm/utils/MediaUploadPolicy.js';
const first = await import(modulePath);
const second = await import(`${modulePath}?copy`);

describe('media upload policy across copies of the module', () => {
  afterEach(() => first.configureMediaUploads());

  it('loads two distinct copies', () => {
    assert.notEqual(first.configureMediaUploads, second.configureMediaUploads);
    assert.notEqual(first.getMediaUploadPolicy, second.getMediaUploadPolicy);
  });

  it('applies a policy set through one copy in the other', () => {
    const ownerPrefix = (accountId) => `owners/${accountId.length}`;
    first.configureMediaUploads({ maxImageBytes: 1234, maxVideoBytes: 5678, ownerPrefix });

    const policy = second.getMediaUploadPolicy();
    assert.equal(policy.maxImageBytes, 1234);
    assert.equal(policy.maxVideoBytes, 5678);
    assert.equal(policy.ownerPrefix, ownerPrefix);
    assert.equal(
      second.requireMediaCaller({ linkedAuth: { userAccount: { id: 'abc' } } }).prefix,
      'owners/3',
    );
  });

  it('resets through either copy', () => {
    first.configureMediaUploads({ maxImageBytes: 99 });
    second.configureMediaUploads();
    assert.equal(first.getMediaUploadPolicy().maxImageBytes, first.DEFAULT_MAX_IMAGE_BYTES);
  });

  it('keeps the state on globalThis under the shared key', () => {
    first.configureMediaUploads({ maxVideoBytes: 42 });
    const key = Symbol.for('@_linked/schema:MediaUploadPolicy');
    assert.equal(globalThis[key].configured.maxVideoBytes, 42);
  });
});
