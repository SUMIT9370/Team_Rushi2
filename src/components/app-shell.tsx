"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Code2,
  Gauge,
  Settings,
  Wind,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/api-docs", label: "API Docs", icon: Code2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const activeItem = navItems.find(item => item.href !== '/' && pathname.startsWith(item.href));
    return activeItem?.label || 'Dashboard';
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-2">
          <Link href="/" className="flex items-center gap-2 font-headline text-lg font-semibold text-sidebar-foreground">
            <Wind className="h-6 w-6 text-accent" />
            <span className="group-data-[collapsible=icon]:hidden">Team Varsha</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
          <SidebarTrigger className="block md:hidden" />
          <h1 className="font-headline text-xl font-semibold">
            {getPageTitle()}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
