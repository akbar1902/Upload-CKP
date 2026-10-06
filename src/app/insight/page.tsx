import type { Metadata } from 'next';
import InsightClient from './_client';

export const metadata: Metadata = {
  title: 'Insight',
};

export default function InsightPage() {
  return <InsightClient />;
}
