"use client";

import React from 'react';
import { formatDateTime, getApprovalActionLabel, getApprovalActionColor } from '@/lib/utils';
import { CheckCircle2, XCircle, RefreshCw, Unlock, History } from 'lucide-react';
import type { Approval } from '@/types/database';

interface ApprovalHistoryProps {
  approvals: Approval[];
}

const actionIcons: Record<string, React.ElementType> = {
  approved: CheckCircle2,
  rejected: XCircle,
  revision_required: RefreshCw,
  reopened: Unlock,
};

export function ApprovalHistory({ approvals }: ApprovalHistoryProps) {
  if (approvals.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center"
        style={{ borderColor: 'var(--border)' }}
      >
        <History className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} aria-hidden="true" />
        <p className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>
          Belum ada riwayat review.
        </p>
        <p className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
          Riwayat akan muncul setelah ada tindakan persetujuan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {approvals.map((approval, index) => {
        const Icon = actionIcons[approval.action] || CheckCircle2;
        const isLast = index === approvals.length - 1;

        return (
          <div key={approval.id} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={`p-1.5 rounded-full shadow-sm ${getApprovalActionColor(approval.action)}`}
                   style={{ border: '2px solid var(--card-bg)', background: 'var(--sand-subtle)' }}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="w-px h-full min-h-[24px]" style={{ background: 'var(--border)' }} />}
            </div>

            {/* Content */}
            <div className="pb-4">
              <div className="flex items-baseline gap-2">
                <span className={`text-[14px] font-semibold ${getApprovalActionColor(approval.action)}`}>
                  {getApprovalActionLabel(approval.action)}
                </span>
                <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>
                  {formatDateTime(approval.created_at)}
                </span>
              </div>
              {approval.reviewer && (
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  oleh {approval.reviewer.full_name}
                </p>
              )}
              {approval.catatan && (
                <p className="text-[14px] mt-1.5 p-3.5 rounded-2xl"
                   style={{
                     color: 'var(--text-primary)',
                     background: 'var(--sand-subtle)',
                     border: '1px solid var(--border)',
                   }}>
                  {approval.catatan}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
