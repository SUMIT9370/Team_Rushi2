'use client';
import { MessageCircle, Bell, AlertCircle, Users, Settings, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import type { User } from '@/firebase/auth/use-user';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

export function HomeScreen({ onNavigate, user }: HomeScreenProps) {
  const firestore = useFirestore();

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'emergencyContacts');
  }, [firestore, user]);

  const {data: contacts} = useCollection(contactsQuery);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
              </div>
              <div>
                <h1 className="text-2xl text-gray-900">MITRAM</h1>
                <p className="text-sm text-gray-500">Your Digital Companion</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-base text-gray-900">{user.displayName}</p>
                <p className="text-sm text-gray-500">{currentDate}</p>
              </div>
              <ImageWithFallback
                src={user.photoURL ?? undefined}
                alt={user.displayName ?? ""}
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200 cursor-pointer"
                onClick={() => onNavigate('settings')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-cyan-600 text-white border-0 shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
          <div className="relative p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl mb-2">{greeting}, {user.displayName}! 👋</h2>
            <p className="text-xl opacity-90">How can I help you today?</p>
          </div>
        </Card>

        {/* Daily Motivational Quote */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <p className="text-xl text-gray-800 mb-1">Today's Inspiration</p>
              <p className="text-lg text-gray-600 italic">
                "Age is an opportunity no less than youth itself." - Henry Wadsworth Longfellow
              </p>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Bell className="w-7 h-7 text-blue-600" />
              </div>
              <p className="text-3xl text-gray-900">0</p>
              <p className="text-sm text-gray-600">Pending Reminders</p>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-purple-600" />
              </div>
              <p className="text-3xl text-gray-900">0</p>
              <p className="text-sm text-gray-600">New Messages</p>
            </div>
          </Card>

          <Card className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <p className="text-3xl text-gray-900">{contacts?.length || 0}</p>
              <p className="text-sm text-gray-600">Emergency Contacts</p>
            </div>
          </Card>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chat with MITRAM */}
          <Card 
            className="p-8 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-blue-500 to-indigo-600 text-white group"
            onClick={() => onNavigate('chat')}
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Chat with MITRAM</h3>
                <p className="text-base opacity-90">Ask me anything, I'm here to help</p>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                AI Powered
              </Badge>
            </div>
          </Card>

          {/* Reminders */}
          <Card 
            className="p-8 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-green-500 to-emerald-600 text-white group"
            onClick={() => onNavigate('reminders')}
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">My Reminders</h3>
                <p className="text-base opacity-90">Manage medicines & appointments</p>
              </div>
            </div>
          </Card>

          {/* Emergency Help */}
          <Card 
            className="p-8 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-red-500 to-rose-600 text-white group"
            onClick={() => onNavigate('emergency')}
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Emergency Help</h3>
                <p className="text-base opacity-90">Quick access to urgent support</p>
              </div>
              <Badge className="bg-white/20 text-white border-0">
                24/7 Available
              </Badge>
            </div>
          </Card>

          {/* Family Connect */}
          <Card 
            className="p-8 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-cyan-500 to-blue-600 text-white group"
            onClick={() => onNavigate('family')}
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Family Connect</h3>
                <p className="text-base opacity-90">Stay connected with loved ones</p>
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card 
            className="p-8 border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-slate-600 to-gray-700 text-white group"
            onClick={() => onNavigate('settings')}
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl mb-2">Settings</h3>
                <p className="text-base opacity-90">Customize your experience</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Voice Assistant Button */}
        <div className="fixed bottom-8 right-8">
          <Button className="h-20 w-20 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full shadow-2xl">
            <Mic className="w-10 h-10" />
          </Button>
        </div>
      </div>
    </div>
  );
}
