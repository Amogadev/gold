'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="relative min-h-screen bg-background font-body">
      <SiteHeader />
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
