'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Bell, AlertCircle, Users, Settings, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import type { User } from '@/firebase/auth/use-user';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { UserData } from '@/firebase/auth/use-user';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
  userData: UserData;
}

const motivationalQuotes = [
  {
    quote: "Age is an opportunity no less than youth itself.",
    author: "Henry Wadsworth Longfellow",
  },
  {
    quote: "The great thing about getting older is that you don't lose all the other ages you've been.",
    author: "Madeleine L'Engle",
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    quote: "Wrinkles should merely indicate where the smiles have been.",
    author: "Mark Twain",
  },
];


export function HomeScreen({ onNavigate, user, userData }: HomeScreenProps) {
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const firestore = useFirestore();

  useEffect(() => {
    // Set a random quote on the client side to avoid hydration mismatch
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'emergencyContacts');
  }, [firestore, user]);

  const {data: contacts} = useCollection(contactsQuery);

  const familyMembersQuery = useMemoFirebase(() => {
    if(!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'familyMembers');
  }, [firestore, user]);

  const { data: familyMembers } = useCollection(familyMembersQuery);
  
  const remindersQuery = useMemoFirebase(() => {
    if(!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'reminders');
  }, [firestore, user]);

  const { data: reminders } = useCollection(remindersQuery);


  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">MITRAM</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-foreground">{userData.displayName}</p>
                <p className="text-xs text-muted-foreground">{currentDate}</p>
              </div>
              <ImageWithFallback
                src={userData.photoURL ?? undefined}
                alt={userData.displayName ?? ""}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 cursor-pointer transition-transform hover:scale-110"
                onClick={() => onNavigate('settings')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Banner */}
        <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden bg-card border shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{greeting}, {userData.displayName}! 👋</h2>
            <p className="text-lg text-muted-foreground">How can I help you today?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 border shadow-sm hover:shadow-md transition-shadow bg-card flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{reminders?.filter(r => !r.completed).length || 0}</p>
              <p className="text-xs text-muted-foreground">Pending Reminders</p>
          </Card>

          <Card className="p-4 border shadow-sm hover:shadow-md transition-shadow bg-card flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{familyMembers?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Family Members</p>
          </Card>

          <Card className="p-4 border shadow-sm hover:shadow-md transition-shadow bg-card flex flex-col items-center text-center space-y-2 col-span-2 md:col-span-1">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-foreground">{contacts?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Emergency Contacts</p>
          </Card>
        </div>


        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="p-6 border shadow-sm hover:shadow-xl transition-all cursor-pointer bg-card group"
            onClick={() => onNavigate('chat')}
          >
            <div className="flex flex-col items-start space-y-3">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Chat with MITRAM</h3>
                <p className="text-sm text-muted-foreground">Ask me anything, I'm here to help</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 border shadow-sm hover:shadow-xl transition-all cursor-pointer bg-card group"
            onClick={() => onNavigate('reminders')}
          >
            <div className="flex flex-col items-start space-y-3">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">My Reminders</h3>
                <p className="text-sm text-muted-foreground">Manage medicines & appointments</p>
              </div>
            </div>
          </Card>

           <Card 
            className="p-6 border shadow-sm hover:shadow-xl transition-all cursor-pointer bg-card group"
            onClick={() => onNavigate('emergency')}
          >
            <div className="flex flex-col items-start space-y-3">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle className="w-7 h-7 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Emergency Help</h3>
                <p className="text-sm text-muted-foreground">Quick access to urgent support</p>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
           <Card 
            className="p-6 border shadow-sm hover:shadow-xl transition-all cursor-pointer bg-card group"
            onClick={() => onNavigate('family')}
          >
            <div className="flex flex-col items-start space-y-3">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Family Connect</h3>
                <p className="text-sm text-muted-foreground">Stay connected with loved ones</p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 border shadow-sm hover:shadow-xl transition-all cursor-pointer bg-card group"
            onClick={() => onNavigate('settings')}
          >
            <div className="flex flex-col items-start space-y-3">
              <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Settings</h3>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </div>
            </div>
          </Card>
        </div>


        {/* Voice Assistant Button */}
        <div className="fixed bottom-8 right-8 z-20">
          <Button size="icon" className="h-16 w-16 bg-primary rounded-full shadow-2xl transform hover:scale-110 transition-transform">
            <Mic className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
