'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Bell, AlertCircle, Users, Settings, Mic, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import type { User } from '@/firebase/auth/use-user';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { UserData } from '@/firebase/auth/use-user';

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

interface HomeScreenProps {
    onNavigate: (screen: Screen) => void;
    user: User;
    userData: UserData;
}

export function HomeScreen({ onNavigate, user, userData }: HomeScreenProps) {
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const firestore = useFirestore();

  useEffect(() => {
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
  
  const features = [
    { name: "Chat", icon: MessageCircle, screen: "chat", color: "text-blue-400" },
    { name: "Health", icon: Activity, screen: "health", color: "text-green-400" },
    { name: "Reminders", icon: Bell, screen: "reminders", color: "text-yellow-400" },
    { name: "Family", icon: Users, screen: "family", color: "text-purple-400" },
    { name: "Emergency", icon: AlertCircle, screen: "emergency", color: "text-red-400" },
    { name: "Settings", icon: Settings, screen: "settings", color: "text-gray-400" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
       <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900/20 via-background to-purple-900/20 -z-10"></div>
      
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">{currentDate}</p>
            <h1 className="text-3xl font-bold">{greeting}, {userData.displayName}!</h1>
          </div>
          <ImageWithFallback
            src={userData.photoURL ?? undefined}
            alt={userData.displayName ?? ""}
            className="w-14 h-14 rounded-full object-cover border-2 border-primary/50 cursor-pointer transition-transform hover:scale-110"
            onClick={() => onNavigate('settings')}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-8">

        {/* Central Hub */}
        <div className="relative flex flex-col items-center justify-center p-8">
            <div className="absolute inset-0 grid grid-cols-2 -z-10">
                <div className="bg-gradient-to-br from-primary/20 to-transparent"></div>
                <div className="bg-gradient-to-bl from-purple-500/20 to-transparent"></div>
            </div>
           <div 
             onClick={() => onNavigate('chat')}
             className="relative w-48 h-48 bg-card/50 border border-primary/20 rounded-full flex flex-col items-center justify-center text-center p-4 cursor-pointer backdrop-blur-lg shadow-2xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30"
           >
              <div className="absolute inset-0 m-auto w-2/3 h-2/3 bg-primary/20 rounded-full animate-pulse -z-10"></div>
              <Mic className="w-16 h-16 text-primary mb-2" />
              <p className="font-semibold">Talk to MITRAM</p>
           </div>
           
           <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-2xl">
              {features.filter(f => f.name !== 'Chat').map(feature => (
                  <div key={feature.name} onClick={() => onNavigate(feature.screen as Screen)} className="text-center group cursor-pointer">
                      <div className={`w-20 h-20 mx-auto bg-card/50 border border-primary/10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/30`}>
                          <feature.icon className={`w-10 h-10 ${feature.color}`} />
                      </div>
                      <p className="mt-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">{feature.name}</p>
                  </div>
              ))}
           </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-card/50 border-primary/10 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Pending</h4>
            <p className="text-3xl font-bold">{reminders?.filter(r => !r.completed).length || 0}</p>
            <p className="text-sm text-muted-foreground">Reminders</p>
          </Card>
          <Card className="p-4 bg-card/50 border-primary/10 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-muted-foreground">Family</h4>
            <p className="text-3xl font-bold">{familyMembers?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Members</p>
          </Card>
          <Card className="p-4 bg-card/50 border-primary/10 backdrop-blur-sm col-span-2 md:col-span-1">
            <h4 className="text-sm font-medium text-muted-foreground">Emergency</h4>
            <p className="text-3xl font-bold">{contacts?.length || 0}</p>
            <p className="text-sm text-muted-foreground">Contacts</p>
          </Card>
        </div>

        {/* Quote Card */}
        <Card className="p-6 bg-card/50 border-primary/10 backdrop-blur-sm">
            <blockquote className="space-y-2">
                <p className="text-lg italic">"{quote.quote}"</p>
                <footer className="text-sm text-right text-muted-foreground">- {quote.author}</footer>
            </blockquote>
        </Card>
      </main>
    </div>
  );
}
