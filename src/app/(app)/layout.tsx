import { SiteHeader } from "@/components/site-header";
import { MainNav } from "@/components/main-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarTitle,
} from "@/components/ui/sidebar-custom";
import { Award } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-background font-body">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
               <Award className="size-8 text-primary" />
               <SidebarTitle className="text-2xl font-bold text-primary font-headline">
                Golden Access
              </SidebarTitle>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <MainNav />
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SiteHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
