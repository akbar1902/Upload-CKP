import React from 'react';
import { getAdminRkDataAction } from '@/app/actions/admin';
import AdminRencanaKinerjaClient from './_client';

export default async function AdminRencanaKinerjaPage() {
  const initialData = await getAdminRkDataAction();

  return <AdminRencanaKinerjaClient initialData={initialData} />;
}
