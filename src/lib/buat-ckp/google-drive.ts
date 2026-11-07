/**
 * Google Drive dari browser (Fase 0 "Buat CKP").
 *
 * - Login memakai Google Identity Services (token model), scope `drive.file`:
 *   aplikasi hanya bisa melihat file/folder yang ia buat sendiri.
 * - File diunggah LANGSUNG dari browser ke Drive (resumable upload), tidak
 *   melewati server SIKAP (Vercel membatasi body request ±4,5 MB).
 * - Token hanya disimpan di memori tab, tidak pernah dikirim ke server SIKAP.
 */

const GIS_SRC = 'https://accounts.google.com/gsi/client';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';

export const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
};

type TokenClient = { requestAccessToken: (override?: { prompt?: string }) => void };

type GoogleOAuth2 = {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
    error_callback?: (error: { type: string; message?: string }) => void;
  }) => TokenClient;
  revoke: (token: string, done?: () => void) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { oauth2?: GoogleOAuth2 } };
  }
}

export type DriveToken = { accessToken: string; expiresAt: number };

export class DriveError extends Error {
  constructor(message: string, readonly status: number, readonly retryable: boolean) {
    super(message);
    this.name = 'DriveError';
  }
}

let gisPromise: Promise<GoogleOAuth2> | null = null;

function loadGis(): Promise<GoogleOAuth2> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Hanya bisa di browser.'));
  if (window.google?.accounts?.oauth2) return Promise.resolve(window.google.accounts.oauth2);
  if (!gisPromise) {
    gisPromise = new Promise<GoogleOAuth2>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const oauth2 = window.google?.accounts?.oauth2;
        if (oauth2) resolve(oauth2);
        else reject(new Error('Google Identity Services tidak tersedia.'));
      };
      script.onerror = () => {
        gisPromise = null;
        reject(new Error('Gagal memuat skrip login Google. Periksa koneksi internet.'));
      };
      document.head.appendChild(script);
    });
  }
  return gisPromise;
}

/** Muat skrip Google lebih awal agar popup login tidak diblokir browser. */
export function preloadGoogle() {
  loadGis().catch(() => undefined);
}

/**
 * Minta access token. HARUS dipanggil langsung dari klik pengguna
 * (popup Google akan diblokir bila tidak).
 */
export async function requestDriveToken(clientId: string, prompt: '' | 'consent' | 'select_account' = ''): Promise<DriveToken> {
  const oauth2 = await loadGis();
  return new Promise<DriveToken>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: DRIVE_SCOPE,
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(new Error(response.error_description || response.error || 'Login Google dibatalkan.'));
          return;
        }
        resolve({
          accessToken: response.access_token,
          expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000,
        });
      },
      error_callback: (error) => {
        reject(new Error(error.type === 'popup_closed' ? 'Jendela login Google ditutup.' : error.message || error.type));
      },
    });
    client.requestAccessToken({ prompt });
  });
}

export async function revokeDriveToken(token: DriveToken | null) {
  if (!token) return;
  try {
    const oauth2 = await loadGis();
    oauth2.revoke(token.accessToken);
  } catch {
    // abaikan: token tetap kedaluwarsa sendiri dalam 1 jam
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number) {
  return status === 0 || status === 408 || status === 429 || status >= 500;
}

async function driveJson<T>(token: DriveToken, url: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        ...(init.body ? { 'Content-Type': 'application/json; charset=UTF-8' } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new DriveError('Koneksi ke Google Drive terputus.', 0, true);
  }
  if (!response.ok) {
    throw new DriveError(await describeError(response), response.status, isRetryableStatus(response.status));
  }
  return (await response.json()) as T;
}

async function describeError(response: Response) {
  if (response.status === 401) return 'Login Google kedaluwarsa. Hubungkan ulang Google Drive.';
  if (response.status === 403) {
    try {
      const body = (await response.json()) as { error?: { message?: string; errors?: Array<{ reason?: string }> } };
      const reason = body.error?.errors?.[0]?.reason;
      if (reason === 'storageQuotaExceeded') return 'Penyimpanan Google Drive penuh.';
      if (reason === 'userRateLimitExceeded' || reason === 'rateLimitExceeded') return 'Terlalu banyak permintaan ke Drive, dicoba lagi.';
      return body.error?.message || 'Akses Google Drive ditolak.';
    } catch {
      return 'Akses Google Drive ditolak.';
    }
  }
  return `Google Drive menolak permintaan (HTTP ${response.status}).`;
}

/** Ulangi operasi bila galatnya sementara (jaringan, 429, 5xx). */
export async function withRetry<T>(run: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      const retryable = error instanceof DriveError ? error.retryable : false;
      if (!retryable || attempt === attempts - 1) break;
      await wait(800 * 2 ** attempt + Math.random() * 400);
    }
  }
  throw lastError;
}

export async function getDriveUser(token: DriveToken) {
  const data = await driveJson<{ user?: { emailAddress?: string; displayName?: string } }>(
    token,
    `${DRIVE_API}/about?fields=user(emailAddress,displayName)`,
  );
  return { email: data.user?.emailAddress ?? '', name: data.user?.displayName ?? '' };
}

function escapeQuery(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

/** Cari folder buatan aplikasi dengan nama itu; buat bila belum ada. */
export async function ensureFolder(token: DriveToken, name: string, parentId?: string): Promise<string> {
  const q = [
    `name = '${escapeQuery(name)}'`,
    `mimeType = '${FOLDER_MIME}'`,
    'trashed = false',
    parentId ? `'${parentId}' in parents` : `'root' in parents`,
  ].join(' and ');
  const found = await withRetry(() =>
    driveJson<{ files?: Array<{ id: string }> }>(
      token,
      `${DRIVE_API}/files?q=${encodeURIComponent(q)}&fields=files(id)&pageSize=1&spaces=drive`,
    ),
  );
  if (found.files?.[0]?.id) return found.files[0].id;

  const created = await withRetry(() =>
    driveJson<{ id: string }>(token, `${DRIVE_API}/files?fields=id`, {
      method: 'POST',
      body: JSON.stringify({ name, mimeType: FOLDER_MIME, parents: parentId ? [parentId] : undefined }),
    }),
  );
  return created.id;
}

export type UploadedFile = { id: string; name: string; webViewLink: string };

function putWithProgress(url: string, blob: Blob, onProgress?: (loaded: number) => void): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', blob.type || 'application/octet-stream');
    xhr.upload.onprogress = (event) => onProgress?.(event.loaded);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as UploadedFile);
        } catch {
          reject(new DriveError('Jawaban Google Drive tidak terbaca.', xhr.status, true));
        }
        return;
      }
      const message =
        xhr.status === 401
          ? 'Login Google kedaluwarsa. Hubungkan ulang Google Drive.'
          : `Unggah ditolak Google Drive (HTTP ${xhr.status}).`;
      reject(new DriveError(message, xhr.status, isRetryableStatus(xhr.status)));
    };
    xhr.onerror = () => reject(new DriveError('Koneksi terputus saat mengunggah.', 0, true));
    xhr.ontimeout = () => reject(new DriveError('Unggah terlalu lama (timeout).', 0, true));
    xhr.send(blob);
  });
}

/** Unggah satu file (resumable session) ke folder Drive. */
export async function uploadToDrive(
  token: DriveToken,
  blob: Blob,
  name: string,
  folderId: string,
  onProgress?: (loaded: number) => void,
): Promise<UploadedFile> {
  return withRetry(async () => {
    let init: Response;
    try {
      init = await fetch(`${UPLOAD_API}/files?uploadType=resumable&fields=id,name,webViewLink`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': blob.type || 'application/octet-stream',
          'X-Upload-Content-Length': String(blob.size),
        },
        body: JSON.stringify({ name, parents: [folderId] }),
      });
    } catch {
      throw new DriveError('Koneksi ke Google Drive terputus.', 0, true);
    }
    if (!init.ok) throw new DriveError(await describeError(init), init.status, isRetryableStatus(init.status));
    const location = init.headers.get('Location');
    if (!location) throw new DriveError('Google Drive tidak memberi alamat unggah.', init.status, true);
    return putWithProgress(location, blob, onProgress);
  });
}

/** Jadikan file bisa dilihat siapa saja yang punya link (untuk penilai). */
export async function shareAnyoneWithLink(token: DriveToken, fileId: string) {
  await withRetry(() =>
    driveJson(token, `${DRIVE_API}/files/${fileId}/permissions?fields=id`, {
      method: 'POST',
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    }),
  );
}

export function folderLink(folderId: string) {
  return `https://drive.google.com/drive/folders/${folderId}`;
}
