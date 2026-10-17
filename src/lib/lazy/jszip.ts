import type JSZipType from 'jszip';

/**
 * Lazy-loader JSZip (~95 KB) dengan interop CommonJS/ESM yang aman.
 *
 * `jszip` tidak menyediakan build ESM (tanpa field `module`), sehingga
 * `await import('jszip')` bisa mengembalikan namespace yang konstruktornya
 * ada di `.default` — tergantung interop bundler. Helper ini menormalkannya
 * sekaligus memusatkan satu titik lazy-load.
 */
export async function loadJSZip(): Promise<typeof JSZipType> {
  const mod = await import('jszip');
  const interop = mod as unknown as { default?: typeof JSZipType };
  return interop.default ?? (mod as unknown as typeof JSZipType);
}
