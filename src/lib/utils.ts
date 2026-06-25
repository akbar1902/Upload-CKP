import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BULAN_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
] as const;

export function getBulanName(bulan: number): string {
  return BULAN_NAMES[bulan - 1] || '';
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return '-';
  return timeStr.substring(0, 5);
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

export function isGoogleDriveLink(url: string): boolean {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft': return 'bg-slate-100 text-slate-700 border-slate-200';
    case 'submitted': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
    case 'revision_required': return 'bg-amber-50 text-amber-700 border-amber-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'draft': return 'Draft';
    case 'submitted': return 'Menunggu Review';
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    case 'revision_required': return 'Perlu Revisi';
    default: return status;
  }
}

export function getApprovalActionLabel(action: string): string {
  switch (action) {
    case 'approved': return 'Disetujui';
    case 'rejected': return 'Ditolak';
    case 'revision_required': return 'Minta Revisi';
    case 'reopened': return 'Dibuka Kembali';
    default: return action;
  }
}

export function getApprovalActionColor(action: string): string {
  switch (action) {
    case 'approved': return 'text-emerald-600';
    case 'rejected': return 'text-red-600';
    case 'revision_required': return 'text-amber-600';
    case 'reopened': return 'text-blue-600';
    default: return 'text-gray-600';
  }
}

/**
 * Executes a Supabase query with automatic retries for network-related failures.
 * This is crucial for fixing the "sleeping tab" issue where the first network
 * request after being idle for several minutes fails due to a dropped TCP connection.
 */
export async function executeWithRetry<T>(
  operation: () => Promise<{ data: T | null; error: any }>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<{ data: T | null; error: any }> {
  let attempt = 1;
  while (true) {
    try {
      const result = await operation();
      
      const errStr = result.error ? JSON.stringify(result.error).toLowerCase() : '';
      const errMsg = result.error?.message?.toLowerCase() || '';
      const errCode = String(result.error?.code || '');
      
      const isTransientError = 
        errMsg.includes('fetch') || 
        errMsg.includes('network') ||
        errMsg.includes('timeout') ||
        errMsg.includes('gateway') ||
        errMsg.includes('connection') ||
        errMsg.includes('server error') ||
        errMsg.includes('upstream') ||
        ['502', '503', '504'].includes(errCode) ||
        errCode.startsWith('08') || // Postgres Connection Exception
        errCode.startsWith('57P');  // Postgres Operator Intervention (e.g. terminating connection)

      // Retry if it's a network error or a DB cold-start/connection drop error
      if (result.error && isTransientError) {
        if (attempt >= maxAttempts) return result;
        console.warn(`[Retry] Supabase operation failed with transient error, retrying attempt ${attempt + 1}/${maxAttempts}...`, result.error);
        await new Promise(res => setTimeout(res, delayMs));
        attempt++;
        continue;
      }
      
      // Return on success or non-network errors (like RLS violations)
      return result;
    } catch (err: any) {
      // Catch native fetch throws if any
      if (err.name === 'AbortError' || attempt >= maxAttempts) throw err;
      
      console.warn(`[Retry] Operation threw error, retrying attempt ${attempt + 1}/${maxAttempts}...`, err);
      await new Promise(res => setTimeout(res, delayMs));
      attempt++;
    }
  }
}
