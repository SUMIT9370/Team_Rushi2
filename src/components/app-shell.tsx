"use client";

import * as React from "react";
import {
  HeartPulse,
  MessageSquare,
  Activity,
  Bell,
  Users,
  ShieldAlert,
  Settings
} from "lucide-react";
import { Screen } from "@/app/page";

const navItems = [
  { screen: "home", label: "Dashboard", icon: HeartPulse },
  { screen: "chat", label: "MITRAM AI", icon: MessageSquare },
  { screen: "health", label: "Health", icon: Activity },
  { screen: "reminders", label: "Reminders", icon: Bell },
  { screen: "family", label: "Family", icon: Users },
  { screen: "emergency", label: "Emergency", icon: ShieldAlert },
  { screen: "settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, onNavigate, activeScreen }: { children: React.ReactNode; onNavigate: (screen: Screen) => void; activeScreen: Screen; }) {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card/40 p-4 md:flex">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">MITRAM</h1>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen as Screen)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:bg-primary/10 hover:text-primary ${
                activeScreen === item.screen
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

       {/* Mobile Bottom Nav */}
       <div className="fixed bottom-0 left-0 right-0 border-t bg-card/90 backdrop-blur-lg md:hidden z-50">
        <nav className="grid grid-cols-6 items-center justify-items-center gap-1 p-2">
          {navItems.filter(item => item.screen !== 'settings').slice(0, 6).map((item) => (
             <button
             key={item.screen}
             onClick={() => onNavigate(item.screen as Screen)}
             className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-xs transition-all w-full ${
               activeScreen === item.screen
                 ? "text-primary"
                 : "text-muted-foreground"
             }`}
           >
             <item.icon className="h-6 w-6" />
             <span className="text-[10px]">{item.label}</span>
           </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
