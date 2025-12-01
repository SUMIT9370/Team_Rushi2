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
import { useUser } from "@/firebase";
import type { User } from 'firebase/auth';


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
  const { user, loading } = useUser();

  const renderScreen = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      );
    }
    if (!user) {
      return <LoginScreen onNavigate={setCurrentScreen} />;
    }

    switch (currentScreen) {
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} user={user} />;
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
          />
        );
      default:
        return <HomeScreen onNavigate={setCurrentScreen} user={user} />;
    }
  };

  return <div className="min-h-screen bg-slate-50">{renderScreen()}</div>;
}
