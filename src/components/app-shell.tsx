'use client';

import * as React from 'react';
import {
  HeartPulse,
  MessageSquare,
  Activity,
  Bell,
  Users,
  ShieldAlert,
  Settings,
  Menu,
} from 'lucide-react';
import { Screen } from '@/app/page';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { User, UserData } from '@/firebase';
import { ImageWithFallback } from './ImageWithFallback';

const navItems = [
  { screen: 'home', label: 'Dashboard', icon: HeartPulse },
  { screen: 'chat', label: 'MITRAM AI', icon: MessageSquare },
  { screen: 'health', label: 'Health', icon: Activity },
  { screen: 'reminders', label: 'Reminders', icon: Bell },
  { screen: 'family', label: 'Family', icon: Users },
  { screen: 'emergency', label: 'Emergency', icon: ShieldAlert },
];

const screenTitles: Record<Screen, string> = {
  home: 'Dashboard',
  chat: 'MITRAM AI Assistant',
  health: 'Health Dashboard',
  reminders: 'My Reminders',
  family: 'Family Circle',
  emergency: 'Emergency Center',
  settings: 'Settings & Profile',
  login: 'Login',
};

export function AppShell({
  children,
  onNavigate,
  activeScreen,
  user,
  userData,
}: {
  children: React.ReactNode;
  onNavigate: (screen: Screen) => void;
  activeScreen: Screen;
  user: User;
  userData: UserData;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card/40 p-4 md:flex">
        <div className="flex items-center gap-2 pb-4 mb-4 border-b">
          <HeartPulse className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">MITRAM</h1>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen as Screen)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-all hover:bg-primary/10 hover:text-primary ${
                activeScreen === item.screen
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-all hover:bg-primary/10 hover:text-primary ${
              activeScreen === 'settings'
                ? 'bg-primary/10 font-semibold text-primary'
                : 'text-muted-foreground'
            }`}
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b bg-card/60 px-4 md:px-8 sticky top-0 z-40 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b">
                    <HeartPulse className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold">MITRAM</h1>
                  </div>
                </SheetHeader>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <button
                      key={item.screen}
                      onClick={() => {
                        onNavigate(item.screen as Screen);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-all hover:bg-primary/10 hover:text-primary ${
                        activeScreen === item.screen
                          ? 'bg-primary/10 font-semibold text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-auto">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-base transition-all hover:bg-primary/10 hover:text-primary ${
                      activeScreen === 'settings'
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </button>
                </div>
              </SheetContent>
            </Sheet>
            <h2 className="text-xl md:text-2xl font-bold">
              {screenTitles[activeScreen]}
            </h2>
          </div>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => onNavigate('settings')}
          >
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-foreground">
                {userData.displayName}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <ImageWithFallback
              src={userData.photoURL}
              alt={userData.displayName || 'user avatar'}
              className="h-10 w-10 rounded-full border-2 border-primary/40"
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
