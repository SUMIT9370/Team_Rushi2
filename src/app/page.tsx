"use client";
import { LoginScreen } from "@/components/LoginScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { ChatScreen } from "@/components/ChatScreen";
import { EmergencyScreen } from "@/components/EmergencyScreen";
import { RemindersScreen } from "@/components/RemindersScreen";
import { FamilyConnectScreen } from "@/components/FamilyConnectScreen";
import { SettingsScreen } from "@/components/SettingsScreen";
import { HealthScreen } from "@/components/HealthScreen";
import { useState } from "react";
import { useUser, useUserData } from "@/firebase";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";


export type Screen =
  | "login"
  | "home"
  | "chat"
  | "emergency"
  | "reminders"
  | "family"
  | "settings"
  | "health";

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  avatar: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const { user, isUserLoading } = useUser();
  const { data: userData, isLoading: isUserDataLoading } = useUserData();

  const renderScreen = () => {
    if (isUserLoading || isUserDataLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
    }
    if (!user || !userData) {
      return <LoginScreen />;
    }

    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} user={user} userData={userData} />;
      case "chat":
        return <ChatScreen onNavigate={setCurrentScreen} user={user} />;
      case "emergency":
        return (
          <EmergencyScreen
            onNavigate={setCurrentScreen}
          />
        );
      case "reminders":
        return <RemindersScreen onNavigate={setCurrentScreen} user={user} />;
      case "family":
        return (
          <FamilyConnectScreen onNavigate={setCurrentScreen} user={user} />
        );
      case "health":
        return <HealthScreen onNavigate={setCurrentScreen} user={user} />;
      case "settings":
        return (
          <SettingsScreen
            onNavigate={setCurrentScreen}
            user={user}
            userData={userData}
          />
        );
      default:
        return <HomeScreen onNavigate={setCurrentScreen} user={user} userData={userData} />;
    }
  };

  return <div className="min-h-screen bg-background">{renderScreen()}<Toaster /></div>;
}