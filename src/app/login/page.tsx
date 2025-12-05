
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page is no longer in use as Firebase has been removed.
// It redirects to the main dashboard.
export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
