// ============================================================
// Database Types - matches Supabase schema
// ============================================================

export type UserRole = 'pegawai' | 'pimpinan' | 'admin';
export type UploadStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'revision_required';
export type ApprovalAction = 'approved' | 'rejected' | 'revision_required' | 'reopened';

export interface User {
  id: string;
  email: string;
  full_name: string;
  nip: string | null;
  role: UserRole;
  unit_kerja: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeProfile {
  id: string;
  user_id: string;
  jabatan: string | null;
  golongan: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CKPUpload {
  id: string;
  user_id: string;
  bulan: number;
  tahun: number;
  status: UploadStatus;
  version: number;
  file_name: string | null;
  file_url: string | null;
  storage_path: string | null;
  total_entries: number;
  avg_progres: number;
  catatan_pimpinan: string | null;
  uploaded_at: string;
  approved_at: string | null;
  approved_by: string | null;
  // Joined fields
  user?: User;
}

export interface CKPEntry {
  id: string;
  upload_id: string;
  row_number: number;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  jam_mulai: string | null;
  jam_selesai: string | null;
  rencana_kinerja: string | null;
  kegiatan: string | null;
  progres: number;
  capaian: string | null;
  data_dukung: string | null;
  extra_columns: Record<string, unknown>;
  created_at: string;
}

export interface Approval {
  id: string;
  upload_id: string;
  reviewer_id: string;
  action: ApprovalAction;
  catatan: string | null;
  created_at: string;
  // Joined fields
  reviewer?: User;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  // Joined fields
  user?: User;
}

// ============================================================
// Database helper types for Supabase queries
// ============================================================

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      employee_profiles: {
        Row: EmployeeProfile;
        Insert: Omit<EmployeeProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EmployeeProfile, 'id' | 'created_at'>>;
      };
      ckp_uploads: {
        Row: CKPUpload;
        Insert: Omit<CKPUpload, 'id' | 'uploaded_at' | 'user'>;
        Update: Partial<Omit<CKPUpload, 'id' | 'uploaded_at' | 'user'>>;
      };
      ckp_entries: {
        Row: CKPEntry;
        Insert: Omit<CKPEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<CKPEntry, 'id' | 'created_at'>>;
      };
      approvals: {
        Row: Approval;
        Insert: Omit<Approval, 'id' | 'created_at' | 'reviewer'>;
        Update: Partial<Omit<Approval, 'id' | 'created_at' | 'reviewer'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at' | 'user'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at' | 'user'>>;
      };
    };
    Enums: {
      user_role: UserRole;
      upload_status: UploadStatus;
      approval_action: ApprovalAction;
    };
  };
};
