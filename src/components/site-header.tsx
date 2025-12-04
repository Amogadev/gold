import { SidebarTrigger } from "@/components/ui/sidebar-custom";
import { UserNav } from "@/components/user-nav";
import { Award } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-2 items-center md:hidden">
          <SidebarTrigger />
          <Award className="size-6 text-primary" />
          <h1 className="text-xl font-bold text-primary font-headline">
            Golden Access
          </h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
