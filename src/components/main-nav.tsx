"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookLock,
  Sparkles,
  User,
  LifeBuoy,
} from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar-custom";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/exclusive-content", label: "Exclusive Content", icon: BookLock },
  { href: "/early-access", label: "Early Access", icon: Sparkles },
  { href: "/profile", label: "My Profile", icon: User },
  { href: "/support", label: "Priority Support", icon: LifeBuoy },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-accent text-accent-foreground"
              )}
              isActive={pathname === item.href}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </nav>
  );
}
