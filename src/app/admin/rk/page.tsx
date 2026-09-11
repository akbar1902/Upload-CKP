import React from 'react';
import { getAdminRkDataAction } from '@/app/actions/admin';
import AdminRencanaKinerjaClient from './_client';

export default async function AdminRencanaKinerjaPage() {
  const { rks = [], subsByRk = {}, ketuaTims = [] } = await getAdminRkDataAction();

  const initialData = { rks, subsByRk, ketuaTims };

  return <AdminRencanaKinerjaClient initialData={initialData} />;
}
