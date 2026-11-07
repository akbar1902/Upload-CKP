/**
 * Kumpulkan file bukti dukung dari ZIP, folder, atau pilihan file biasa.
 * ZIP dibaca per entri (zip.js + BlobReader): isi ZIP TIDAK dimuat utuh ke
 * memori, jadi ZIP ratusan MB tetap aman di laptop RAM kecil.
 */
import { BlobReader, BlobWriter, ZipReader, configure } from '@zip.js/zip.js';
import { kindOf, mimeOf } from './compress';

// DecompressionStream bawaan browser bekerja di luar thread utama;
// web worker zip.js tidak dipakai agar tidak perlu file worker terpisah.
configure({ useWebWorkers: false, useCompressionStream: true });

export type SourceItem = {
  id: string;
  /** Path relatif (termasuk folder di dalam ZIP). */
  path: string;
  size: number;
  origin: string;
  read: () => Promise<Blob>;
};

export type CollectResult = {
  items: SourceItem[];
  skipped: string[];
  close: () => Promise<void>;
};

function isZip(file: File) {
  return file.name.toLowerCase().endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
}

export async function collectItems(files: File[]): Promise<CollectResult> {
  const items: SourceItem[] = [];
  const skipped: string[] = [];
  const readers: ZipReader<Blob>[] = [];
  let counter = 0;

  for (const file of files) {
    if (isZip(file)) {
      const reader = new ZipReader(new BlobReader(file));
      readers.push(reader);
      const entries = await reader.getEntries();
      for (const entry of entries) {
        if (entry.directory) continue;
        if (kindOf(entry.filename) === 'skip') {
          skipped.push(`${file.name}/${entry.filename}`);
          continue;
        }
        if (entry.encrypted) {
          skipped.push(`${file.name}/${entry.filename} (terkunci password)`);
          continue;
        }
        const path = entry.filename;
        items.push({
          id: `z${counter++}`,
          path,
          size: entry.uncompressedSize,
          origin: file.name,
          read: () => entry.getData(new BlobWriter(mimeOf(path))),
        });
      }
      continue;
    }

    const path = (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    if (kindOf(path) === 'skip') {
      skipped.push(path);
      continue;
    }
    items.push({
      id: `f${counter++}`,
      path,
      size: file.size,
      origin: 'file terpilih',
      read: async () => file,
    });
  }

  return {
    items,
    skipped,
    close: async () => {
      await Promise.all(readers.map((reader) => reader.close().catch(() => undefined)));
    },
  };
}
