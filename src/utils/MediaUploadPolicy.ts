/**
 * Server-side rules for the media file methods of `ImageObjectProvider` and
 * `VideoObjectProvider`: who may call them, how large an upload may be, and
 * which store keys a caller may touch.
 *
 * Ownership model: every file a caller writes is stored under a prefix derived
 * from their own session (`users/<sha256 of the account id>` by default), and
 * listing and deleting only reach keys under that prefix. The client chooses
 * the path below the prefix; every key a call reads, writes or deletes is in
 * the caller's own folder.
 *
 * Server-only: imports `crypto`.
 */
import { createHash } from 'crypto';
import { sharedState } from '@_linked/core/utils/sharedState';

declare var process: any;

const MiB = 1024 * 1024;

export interface MediaUploadPolicy {
  /** Largest image accepted by `fromDataURL` and `ImageObjectProvider.fromFormFile`, in bytes. */
  maxImageBytes: number;
  /** Largest video accepted by `VideoObjectProvider.fromFormFile`, in bytes. */
  maxVideoBytes: number;
  /**
   * The store folder a signed-in caller owns, without leading or trailing
   * slash. Receives the request's `linkedAuth` and the account id taken from
   * it. Must be a relative path with no `.` or `..` segments.
   */
  ownerPrefix: (accountId: string, linkedAuth: any) => string;
}

export const DEFAULT_MAX_IMAGE_BYTES = 10 * MiB;
export const DEFAULT_MAX_VIDEO_BYTES = 200 * MiB;

export function defaultOwnerPrefix(accountId: string): string {
  return (
    'users/' + createHash('sha256').update(accountId).digest('hex').slice(0, 32)
  );
}

function envBytes(name: string, fallback: number): number {
  const raw = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    console.warn(
      `[schema] ${name}=${raw} is not a positive number of bytes; using ${fallback}.`
    );
    return fallback;
  }
  return Math.floor(value);
}

// On `globalThis`, so a policy the app configures reaches an uploader that
// loaded another copy of this module (see the shared-state convention in
// linked-fw/cli's docs/architecture/shared-state-and-error-brands.md).
const state = sharedState('@_linked/schema', 'MediaUploadPolicy', () => ({
  configured: {} as Partial<MediaUploadPolicy>,
}));

/**
 * Override the upload rules. Values not given fall back to the environment
 * (`LINKED_MAX_IMAGE_UPLOAD_BYTES`, `LINKED_MAX_VIDEO_UPLOAD_BYTES`) and then to
 * the defaults (10 MiB for images, 200 MiB for video). Call with no argument
 * to reset.
 */
export function configureMediaUploads(next: Partial<MediaUploadPolicy> = {}): void {
  for (const key of ['maxImageBytes', 'maxVideoBytes'] as const) {
    const value = next[key];
    if (value !== undefined && !(Number.isFinite(value) && value > 0)) {
      throw new Error(`${key} must be a positive number of bytes.`);
    }
  }
  state.configured = { ...next };
}

export function getMediaUploadPolicy(): MediaUploadPolicy {
  const configured = state.configured ?? {};
  return {
    maxImageBytes:
      configured.maxImageBytes ??
      envBytes('LINKED_MAX_IMAGE_UPLOAD_BYTES', DEFAULT_MAX_IMAGE_BYTES),
    maxVideoBytes:
      configured.maxVideoBytes ??
      envBytes('LINKED_MAX_VIDEO_UPLOAD_BYTES', DEFAULT_MAX_VIDEO_BYTES),
    ownerPrefix: configured.ownerPrefix ?? defaultOwnerPrefix,
  };
}

/**
 * An error the LINKED server answers with `status` instead of 500. It is
 * matched by shape (`name` + numeric `status`), as `ServerCallError.is` does.
 */
export function mediaCallError(status: number, message: string): Error {
  const error = new Error(message) as Error & { status: number };
  error.name = 'ServerCallError';
  error.status = status;
  return error;
}

/**
 * Validate a client-supplied store path and return it in canonical form
 * (forward slashes, no leading `./`). Rejects absolute paths, drive letters,
 * backslashes, control characters, empty segments and `.`/`..` segments.
 */
export function safeRelativePath(filePath: unknown, label = 'filePath'): string {
  if (typeof filePath !== 'string' || !filePath.trim()) {
    throw mediaCallError(400, `${label} is required.`);
  }
  let clean = filePath.trim();
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f\\]/.test(clean)) {
    throw mediaCallError(400, `${label} contains characters that are not allowed.`);
  }
  if (clean.startsWith('/') || /^[A-Za-z]:/.test(clean)) {
    throw mediaCallError(400, `${label} must be a relative path.`);
  }
  while (clean.startsWith('./')) clean = clean.slice(2);
  const segments = clean.split('/');
  for (const segment of segments) {
    if (!segment || segment === '.' || segment === '..') {
      throw mediaCallError(400, `${label} must not contain empty, "." or ".." segments.`);
    }
    // A segment that only becomes "." or ".." after percent-decoding is
    // rejected too: a store or proxy further down may decode it.
    let decoded = segment;
    try {
      decoded = decodeURIComponent(segment);
    } catch {
      throw mediaCallError(400, `${label} is not a valid path.`);
    }
    if (decoded === '.' || decoded === '..' || /[\\/]/.test(decoded)) {
      throw mediaCallError(400, `${label} must not contain empty, "." or ".." segments.`);
    }
  }
  return segments.join('/');
}

export interface MediaCaller {
  accountId: string;
  /** Store folder the caller owns, no trailing slash. */
  prefix: string;
}

/**
 * The signed-in caller of a media method, read synchronously from the request.
 * Throws a 401 when there is no session.
 */
export function requireMediaCaller(request: any): MediaCaller {
  const linkedAuth = request?.linkedAuth;
  const account = linkedAuth?.userAccount;
  const accountId =
    typeof account === 'string' ? account : typeof account?.id === 'string' ? account.id : '';
  if (!accountId) {
    throw mediaCallError(401, 'Sign in to manage files.');
  }
  const prefix = safeRelativePath(
    getMediaUploadPolicy().ownerPrefix(accountId, linkedAuth),
    'ownerPrefix'
  );
  return { accountId, prefix };
}

/** The store key a caller's upload of `filePath` is written to. */
export function ownedKey(caller: MediaCaller, filePath: unknown): string {
  return `${caller.prefix}/${safeRelativePath(filePath)}`;
}

/**
 * Resolve a delete target to a key the caller owns, or throw 404.
 *
 * Accepts a store key (`users/<id>/images/logo.png`) or the public URL a save
 * returned, in which case the key is read from the URL path starting at the
 * caller's own prefix.
 */
export function ownedKeyForDelete(caller: MediaCaller, target: unknown): string {
  let candidate = typeof target === 'string' ? target.trim() : '';
  if (/^https?:\/\//i.test(candidate)) {
    let pathname: string;
    try {
      pathname = new URL(candidate).pathname;
    } catch {
      throw mediaCallError(400, 'filePath is not a valid URL.');
    }
    const at = pathname.indexOf(`/${caller.prefix}/`);
    if (at === -1) throw mediaCallError(404, 'File not found.');
    candidate = pathname.slice(at + 1);
  }
  const key = safeRelativePath(candidate);
  if (!key.startsWith(`${caller.prefix}/`)) {
    throw mediaCallError(404, 'File not found.');
  }
  return key;
}

/** Upper bound on the decoded size of a base64 payload, without decoding it. */
export function base64DecodedLength(base64: string): number {
  const length = base64.length;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.floor((length * 3) / 4) - padding;
}
