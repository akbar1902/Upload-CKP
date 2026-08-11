import { Metadata } from 'next';
import ApprovalClient from './_client';

export const metadata: Metadata = {
  title: 'Persetujuan Cepat - Upload CKP',
};

export default function PimpinanApprovalPage() {
  return <ApprovalClient />;
}
