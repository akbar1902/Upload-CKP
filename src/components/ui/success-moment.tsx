import { toast } from 'sonner';
import s from './success-moment.module.css';

/**
 * Ikon sukses: lingkaran muncul, centang tergambar sekali, lalu sehelai daun
 * kecil melintas. Sangat kecil (24px) — stroke-dashoffset pada elemen sekecil
 * ini murah; daun hanya transform/opacity. Sekali jalan, bukan berulang.
 */
function SuccessIcon() {
  return (
    <span className={s.wrap} aria-hidden="true">
      <svg className={s.icon} viewBox="0 0 24 24" width="22" height="22">
        <circle className={s.circle} cx="12" cy="12" r="11" />
        <path className={s.check} d="M7 12.4 l3.2 3 l6.8 -7" pathLength={1} />
      </svg>
      <svg className={s.leaf} viewBox="0 0 20 20" width="9" height="9">
        <path d="M10 1 C 16.5 5 17.5 13 10 19 C 2.5 13 3.5 5 10 1 Z" />
      </svg>
    </span>
  );
}

/** Toast sukses untuk momen penting (upload CKP, penilaian disimpan). */
export function toastSuccessMoment(message: string, description?: string) {
  return toast.success(message, { icon: <SuccessIcon />, description });
}
