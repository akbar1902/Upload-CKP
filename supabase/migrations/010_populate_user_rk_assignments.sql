-- Memigrasikan penugasan RK yang sudah ada dari tabel ckp_entries
-- Karena sebelumnya RK melekat pada setiap upload CKP, kita ekstrak data uniknya
-- dan masukkan ke dalam tabel user_rk_assignments agar RK tersebut muncul di menu "RK Saya".

INSERT INTO public.user_rk_assignments (rencana_kinerja, user_id)
SELECT DISTINCT e.rencana_kinerja, u.user_id
FROM public.ckp_entries e
JOIN public.ckp_uploads u ON e.upload_id = u.id
WHERE e.rencana_kinerja IS NOT NULL AND e.rencana_kinerja != ''
ON CONFLICT (rencana_kinerja, user_id) DO NOTHING;
