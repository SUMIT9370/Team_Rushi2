"use client";
import { useState } from "react";
import { Heart, ChevronRight, Shield, Users, Activity } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { signInWithGoogle } from "@/firebase/auth/signin";
import type { Screen } from "@/app/page";

interface LoginScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl">MITRAM</span>
          </div>

          <h1 className="text-5xl md:text-6xl text-gray-900">
            Your Digital
            <span className="block bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Companion
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-md">
            A smart, caring friend that helps you stay connected, healthy, and
            safe every day.
          </p>

          <div className="grid grid-cols-1 gap-4 max-w-md">
            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="text-base text-gray-900">Safe & Secure</p>
                <p className="text-sm text-gray-500">Your privacy matters</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <div className="text-left">
                <p className="text-base text-gray-900">Family Connected</p>
                <p className="text-sm text-gray-500">Stay close to loved ones</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="text-base text-gray-900">Health Monitoring</p>
                <p className="text-sm text-gray-500">Track your wellness</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="p-8 md:p-12 shadow-2xl border-0 bg-white/80 backdrop-blur">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl text-gray-900">Welcome!</h2>
              <p className="text-lg text-gray-600">Let's get you started</p>
            </div>

            <Button
              onClick={handleLogin}
              className="w-full h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Sign in with Google
              <ChevronRight className="w-6 h-6 ml-2" />
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
