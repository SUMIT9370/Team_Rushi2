'use client';
import { LoginScreen } from '@/components/LoginScreen';
import { HomeScreen } from '@/components/HomeScreen';
import { ChatScreen } from '@/components/ChatScreen';
import { EmergencyScreen } from '@/components/EmergencyScreen';
import { RemindersScreen } from '@/components/RemindersScreen';
import { FamilyConnectScreen } from '@/components/FamilyConnectScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { HealthScreen } from '@/components/HealthScreen';
import { useState } from 'react';
import { useUser, useUserData } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import { AppShell } from '@/components/app-shell';

export type Screen =
  | 'login'
  | 'home'
  | 'chat'
  | 'emergency'
  | 'reminders'
  | 'family'
  | 'settings'
  | 'health';

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  avatar: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const { user, isUserLoading } = useUser();
  const { data: userData, isLoading: isUserDataLoading } = useUserData();

  const renderScreen = () => {
    if (isUserLoading || (user && isUserDataLoading)) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    if (!user) {
      return <LoginScreen />;
    }

    if (!userData) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">Loading user data...</p>
        </div>
      );
    }

    let screenComponent;
    switch (currentScreen) {
      case 'home':
        screenComponent = (
          <HomeScreen
            onNavigate={setCurrentScreen}
            user={user}
            userData={userData}
          />
        );
        break;
      case 'chat':
        screenComponent = <ChatScreen onNavigate={setCurrentScreen} user={user} />;
        break;
      case 'emergency':
        screenComponent = <EmergencyScreen onNavigate={setCurrentScreen} />;
        break;
      case 'reminders':
        screenComponent = (
          <RemindersScreen onNavigate={setCurrentScreen} user={user} />
        );
        break;
      case 'family':
        screenComponent = (
          <FamilyConnectScreen onNavigate={setCurrentScreen} user={user} />
        );
        break;
      case 'health':
        screenComponent = <HealthScreen onNavigate={setCurrentScreen} user={user} />;
        break;
      case 'settings':
        screenComponent = (
          <SettingsScreen
            onNavigate={setCurrentScreen}
            user={user}
            userData={userData}
          />
        );
        break;
      default:
        screenComponent = (
          <HomeScreen
            onNavigate={setCurrentScreen}
            user={user}
            userData={userData}
          />
        );
    }

    return (
      <AppShell
        onNavigate={setCurrentScreen}
        activeScreen={currentScreen}
        user={user}
        userData={userData}
      >
        {screenComponent}
      </AppShell>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <Toaster />
    </div>
  );
}
