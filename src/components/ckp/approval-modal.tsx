"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import type { ApprovalAction } from '@/types/database';

interface ApprovalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (action: ApprovalAction, catatan: string) => Promise<void>;
  employeeName: string;
  period: string;
  defaultAction?: ApprovalAction;
}

export function ApprovalModal({ open, onClose, onSubmit, employeeName, period, defaultAction = 'approved' }: ApprovalModalProps) {
  const [action, setAction] = useState<ApprovalAction>(defaultAction);
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync action when defaultAction changes (different button triggered modal)
  React.useEffect(() => {
    if (open) setAction(defaultAction);
  }, [open, defaultAction]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(action, catatan);
      setCatatan('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const actions = [
    {
      value: 'approved' as ApprovalAction,
      label: 'Setujui',
      icon: CheckCircle2,
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
      activeColor: 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-500/20',
    },
    {
      value: 'rejected' as ApprovalAction,
      label: 'Tolak',
      icon: XCircle,
      color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      activeColor: 'bg-red-100 border-red-400 ring-2 ring-red-500/20',
    },
    {
      value: 'revision_required' as ApprovalAction,
      label: 'Minta Revisi',
      icon: RefreshCw,
      color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
      activeColor: 'bg-amber-100 border-amber-400 ring-2 ring-amber-500/20',
    },
  ];

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review CKP</DialogTitle>
          <DialogDescription>
            {employeeName} — {period}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-5">
          {/* Action selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Pilih Tindakan
            </label>
            <div className="grid grid-cols-3 gap-3">
              {actions.map((a) => {
                const Icon = a.icon;
                const isActive = action === a.value;
                return (
                  <button
                    key={a.value}
                    onClick={() => setAction(a.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      isActive ? a.activeColor : a.color
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-xs font-semibold">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Catatan {action !== 'approved' && <span className="text-red-500">*</span>}
            </label>
            <Textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder={
                action === 'approved'
                  ? 'Catatan opsional...'
                  : action === 'rejected'
                  ? 'Jelaskan alasan penolakan...'
                  : 'Jelaskan hal yang perlu direvisi...'
              }
              rows={4}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            disabled={action !== 'approved' && catatan.trim().length === 0}
            variant={action === 'approved' ? 'success' : action === 'rejected' ? 'destructive' : 'warning'}
          >
            {action === 'approved' ? 'Setujui CKP' : action === 'rejected' ? 'Tolak CKP' : 'Minta Revisi'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
