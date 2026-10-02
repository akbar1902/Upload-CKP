"use server";

import { gradeRencanaKinerjaAction as gradeRencanaKinerjaActionMain, approveAction as approveActionMain } from '@/app/actions/penilaian';

// This function grades ALL entries under a specific Rencana Kinerja for a given upload
export async function gradeRencanaKinerjaAction(uploadId: string, rencanaKinerja: string, score: number | null) {
  return gradeRencanaKinerjaActionMain(uploadId, rencanaKinerja, score);
}

export async function approveAction(uploadId: string, action: string, catatan: string) {
  return approveActionMain(uploadId, action, catatan);
}
