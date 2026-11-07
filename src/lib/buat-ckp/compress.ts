/**
 * Kompresi foto bukti dukung di browser (Fase 0 "Buat CKP").
 * Hanya foto yang dikompres; PDF, dokumen, dan video diunggah apa adanya.
 */

export type Preset = 'hemat' | 'standar' | 'asli';

export const PRESETS: Record<Preset, { label: string; detail: string; maxSide: number | null; quality: number }> = {
  hemat: { label: 'Hemat', detail: 'sisi terpanjang 1600 px, JPEG 80%', maxSide: 1600, quality: 0.8 },
  standar: { label: 'Standar', detail: 'sisi terpanjang 1920 px, JPEG 80%', maxSide: 1920, quality: 0.8 },
  asli: { label: 'Asli', detail: 'tanpa kompresi', maxSide: null, quality: 1 },
};

export type FileKind = 'image' | 'heic' | 'other' | 'skip';

const IMAGE_EXT = new Set(['jpg', 'jpeg', 'png', 'webp']);
const HEIC_EXT = new Set(['heic', 'heif']);

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  txt: 'text/plain',
};

export function extOf(name: string) {
  const base = name.split('/').pop() ?? name;
  const dot = base.lastIndexOf('.');
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : '';
}

export function mimeOf(name: string) {
  return MIME_BY_EXT[extOf(name)] ?? 'application/octet-stream';
}

/** Nama file tanpa folder di dalam ZIP. */
export function baseName(path: string) {
  return path.split(/[\\/]/).pop() ?? path;
}

export function kindOf(path: string): FileKind {
  const name = baseName(path);
  const lower = path.toLowerCase();
  if (!name || name.startsWith('.') || name === 'Thumbs.db' || name === 'desktop.ini') return 'skip';
  if (lower.includes('__macosx/')) return 'skip';
  const ext = extOf(name);
  if (IMAGE_EXT.has(ext)) return 'image';
  if (HEIC_EXT.has(ext)) return 'heic';
  return 'other';
}

function replaceExt(name: string, ext: string) {
  const dot = name.lastIndexOf('.');
  return `${dot > 0 ? name.slice(0, dot) : name}.${ext}`;
}

export type PreparedFile = {
  blob: Blob;
  name: string;
  compressed: boolean;
  width?: number;
  height?: number;
};

async function heicToJpeg(blob: Blob): Promise<Blob> {
  const { default: heic2any } = await import('heic2any');
  const result = await heic2any({ blob, toType: 'image/jpeg', quality: 0.92 });
  return Array.isArray(result) ? result[0] : result;
}

async function readSize(blob: Blob) {
  try {
    const bitmap = await createImageBitmap(blob);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return {};
  }
}

/**
 * Siapkan satu file untuk diunggah sesuai preset.
 * Bila hasil kompresi justru lebih besar, file asli yang dipakai.
 */
export async function prepareFile(source: Blob, path: string, preset: Preset): Promise<PreparedFile> {
  const name = baseName(path);
  const kind = kindOf(path);
  const typed = source.type ? source : new Blob([source], { type: mimeOf(name) });

  if (kind === 'other' || kind === 'skip') return { blob: typed, name, compressed: false };

  let input: Blob = typed;
  let outName = name;
  if (kind === 'heic') {
    input = await heicToJpeg(typed);
    outName = replaceExt(name, 'jpg');
  }

  const config = PRESETS[preset];
  if (!config.maxSide) {
    return { blob: input, name: outName, compressed: kind === 'heic', ...(await readSize(input)) };
  }

  const { default: imageCompression } = await import('browser-image-compression');
  const ext = extOf(outName);
  const keepPng = ext === 'png';
  const file = new File([input], outName, { type: input.type || mimeOf(outName) });
  const output = await imageCompression(file, {
    maxWidthOrHeight: config.maxSide,
    initialQuality: config.quality,
    maxSizeMB: 50, // ukuran dibatasi lewat resolusi + kualitas, bukan target MB
    useWebWorker: true,
    fileType: keepPng ? 'image/png' : 'image/jpeg',
    preserveExif: !keepPng,
  });

  if (output.size >= input.size) {
    return { blob: input, name: outName, compressed: kind === 'heic', ...(await readSize(input)) };
  }
  const finalName = keepPng ? outName : replaceExt(outName, 'jpg');
  return { blob: output, name: finalName, compressed: true, ...(await readSize(output)) };
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function formatDuration(ms: number) {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m} mnt ${s} dtk` : `${s} dtk`;
}
