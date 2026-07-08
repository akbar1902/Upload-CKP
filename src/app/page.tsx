"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
      <div className="animate-spin w-8 h-8 rounded-full" style={{ border: '2px solid var(--border)', borderTopColor: 'var(--primary)' }} />
    </div>
  );
}
