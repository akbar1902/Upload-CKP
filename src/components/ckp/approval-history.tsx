"use client";

import React from 'react';
import { formatDateTime, getApprovalActionLabel, getApprovalActionColor } from '@/lib/utils';
import { CheckCircle2, XCircle, RefreshCw, Unlock } from 'lucide-react';
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
      <p className="text-[14px] italic py-4" style={{ color: 'var(--text-tertiary)' }}>
        Belum ada riwayat review.
      </p>
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
                   style={{ border: '2px solid var(--card-bg)', background: 'var(--bg-secondary)' }}>
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
                     background: 'var(--bg-secondary)',
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
