'use client';

import { SectionError } from '@/components/ui/section-error';

export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <SectionError {...props} />;
}
