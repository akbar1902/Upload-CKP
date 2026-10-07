import React from 'react';
import { getAdminRkDataAction } from '@/app/actions/admin';
import { RkManagementView } from '@/components/rk/rk-management-view';

export default async function AdminRencanaKinerjaPage() {
  const initialData = await getAdminRkDataAction();

  return <RkManagementView initialData={initialData} canEdit={true} />;
}
