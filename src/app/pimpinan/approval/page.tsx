import { Metadata } from 'next';
import ApprovalClient from './_client';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Persetujuan Cepat - Upload CKP',
};

export default function PimpinanApprovalPage() {
  return (
    <Suspense fallback={null}>
      <ApprovalClient />
    </Suspense>
  );
}
