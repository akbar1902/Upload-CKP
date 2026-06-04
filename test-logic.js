const uploads = [
  { id: 1, bulan: 6, tahun: 2026, version: 1, status: 'rejected', uploaded_at: '2026-06-02T00:00:00Z' },
  { id: 2, bulan: 6, tahun: 2026, version: 2, status: 'approved', uploaded_at: '2026-06-04T00:00:00Z' },
  { id: 3, bulan: 5, tahun: 2026, version: 1, status: 'draft', uploaded_at: '2026-05-01T00:00:00Z' }
];

uploads.sort((a, b) => {
  if (a.tahun !== b.tahun) return b.tahun - a.tahun;
  if (a.bulan !== b.bulan) return b.bulan - a.bulan;
  return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
});

console.log("Sorted uploads:", uploads);

const seen = new Set();
const uniqueUploads = uploads.filter(u => {
  const key = `${u.bulan}-${u.tahun}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

console.log("Unique uploads:", uniqueUploads);

const rejected = uniqueUploads.filter(u => u.status === 'rejected' || u.status === 'revision_required').length;
console.log("Rejected count:", rejected);
