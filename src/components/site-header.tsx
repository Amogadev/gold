'use client';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
          <Gem className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            Gold Loan
          </span>
        </Link>
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
