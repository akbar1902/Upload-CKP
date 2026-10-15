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
      bg: 'var(--success-soft)',
      color: 'var(--success)',
      activeBorder: 'var(--success)',
    },
    {
      value: 'rejected' as ApprovalAction,
      label: 'Tolak',
      icon: XCircle,
      bg: 'var(--danger-soft)',
      color: 'var(--danger)',
      activeBorder: 'var(--danger)',
    },
    {
      value: 'revision_required' as ApprovalAction,
      label: 'Minta Revisi',
      icon: RefreshCw,
      bg: 'var(--warning-soft)',
      color: 'var(--warning)',
      activeBorder: 'var(--warning)',
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
            <label className="block text-[13px] font-medium mb-3"
                   style={{ color: 'var(--text-primary)' }}>
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
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200"
                    style={{
                      background: a.bg,
                      color: a.color,
                      border: isActive ? `2px solid ${a.activeBorder}` : '2px solid transparent',
                      boxShadow: isActive ? `0 0 0 4px ${a.bg}` : 'none',
                    }}
                  >
                    <Icon className="h-6 w-6" />
                    <span className="text-[12px] font-semibold">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[13px] font-medium mb-2"
                   style={{ color: 'var(--text-primary)' }}>
              Catatan {action !== 'approved' && <span style={{ color: 'var(--danger)' }}>*</span>}
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
