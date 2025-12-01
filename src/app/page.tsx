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

export type Screen =
  | "login"
  | "home"
  | "chat"
  | "emergency"
  | "reminders"
  | "family"
  | "settings"
  | "health";

export interface User {
  name: string;
  age: number;
  profileImage: string;
}

export interface EmergencyContact {
  id: number;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  avatar: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [user, setUser] = useState<User | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([
    {
      id: 1,
      name: "Sarah Johnson",
      relation: "Daughter",
      phone: "+1 (555) 123-4567",
      isPrimary: true,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
      id: 2,
      name: "Dr. Michael Smith",
      relation: "Doctor",
      phone: "+1 (555) 987-6543",
      isPrimary: false,
      avatar:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
    },
    {
      id: 3,
      name: "John Johnson",
      relation: "Son",
      phone: "+1 (555) 456-7890",
      isPrimary: false,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
  ]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentScreen("home");
  };

  const renderScreen = () => {
    if (!user && currentScreen !== "login") {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (currentScreen) {
      case "login":
        return <LoginScreen onLogin={handleLogin} />;
      case "home":
        return <HomeScreen onNavigate={setCurrentScreen} user={user!} />;
      case "chat":
        return <ChatScreen onNavigate={setCurrentScreen} user={user!} />;
      case "emergency":
        return (
          <EmergencyScreen
            onNavigate={setCurrentScreen}
            contacts={emergencyContacts}
            setContacts={setEmergencyContacts}
          />
        );
      case "reminders":
        return <RemindersScreen onNavigate={setCurrentScreen} user={user!} />;
      case "family":
        return (
          <FamilyConnectScreen onNavigate={setCurrentScreen} user={user!} />
        );
      case "health":
        return <HealthScreen onNavigate={setCurrentScreen} user={user!} />;
      case "settings":
        return (
          <SettingsScreen
            onNavigate={setCurrentScreen}
            user={user!}
            setUser={setUser}
          />
        );
      default:
        return <HomeScreen onNavigate={setCurrentScreen} user={user!} />;
    }
  };

  return <div className="min-h-screen bg-slate-50">{renderScreen()}</div>;
}
