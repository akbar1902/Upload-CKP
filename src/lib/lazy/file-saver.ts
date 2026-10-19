/**
 * Lazy-load `file-saver` (~10 KB) — hanya saat pengguna benar-benar
 * mengunduh berkas. Import statis sebelumnya membuat library ini ikut
 * masuk ke initial JS pada rute yang memakainya.
 */
export async function loadSaveAs(): Promise<(blob: Blob, filename?: string) => void> {
  const mod = await import('file-saver');
  const saveAs = (mod as unknown as { default?: typeof import('file-saver').saveAs }).default
    ?? (mod as unknown as typeof import('file-saver').saveAs);
  return saveAs;
}
