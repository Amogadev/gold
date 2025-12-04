import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Award } from "lucide-react";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Award className="size-8 text-primary" />
            <span className="font-bold text-primary font-headline text-2xl">
              Golden Access
            </span>
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
