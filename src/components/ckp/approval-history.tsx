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
      <p className="text-sm text-slate-400 italic py-4">Belum ada riwayat review.</p>
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
              <div className={`p-1.5 rounded-full border-2 border-white bg-slate-50 shadow-sm ${getApprovalActionColor(approval.action)}`}>
                <Icon className="h-4 w-4" />
              </div>
              {!isLast && <div className="w-px h-full bg-slate-200 min-h-[24px]" />}
            </div>

            {/* Content */}
            <div className={`pb-4 ${isLast ? '' : ''}`}>
              <div className="flex items-baseline gap-2">
                <span className={`text-sm font-semibold ${getApprovalActionColor(approval.action)}`}>
                  {getApprovalActionLabel(approval.action)}
                </span>
                <span className="text-xs text-slate-400">
                  {formatDateTime(approval.created_at)}
                </span>
              </div>
              {approval.reviewer && (
                <p className="text-xs text-slate-500 mt-0.5">
                  oleh {approval.reviewer.full_name}
                </p>
              )}
              {approval.catatan && (
                <p className="text-sm text-slate-600 mt-1 bg-slate-50 rounded-lg p-3 border border-slate-100">
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
