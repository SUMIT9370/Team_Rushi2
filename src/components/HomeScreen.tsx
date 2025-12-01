'use client';
import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Bell,
  AlertCircle,
  Users,
  Settings,
  Activity,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Screen } from '../app/page';
import type { User, UserData } from '@/firebase';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

const motivationalQuotes = [
  {
    quote: 'Age is an opportunity no less than youth itself.',
    author: 'Henry Wadsworth Longfellow',
  },
  {
    quote:
      "The great thing about getting older is that you don't lose all the other ages you've been.",
    author: "Madeleine L'Engle",
  },
  {
    quote: 'You are never too old to set another goal or to dream a new dream.',
    author: 'C.S. Lewis',
  },
  {
    quote: 'Wrinkles should merely indicate where the smiles have been.',
    author: 'Mark Twain',
  },
];

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
  userData: UserData;
}

export function HomeScreen({ onNavigate, user, userData }: HomeScreenProps) {
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const firestore = useFirestore();

  useEffect(() => {
    // This runs only on the client, avoiding hydration mismatch
    setQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );
  }, []);

  const contactsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'emergencyContacts');
  }, [firestore, user]);

  const { data: contacts } = useCollection(contactsQuery);

  const familyMembersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'familyMembers');
  }, [firestore, user]);

  const { data: familyMembers } = useCollection(familyMembersQuery);

  const remindersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'reminders');
  }, [firestore, user]);

  const { data: reminders } = useCollection(remindersQuery);

  const features = [
    {
      name: 'Chat with AI',
      icon: MessageCircle,
      screen: 'chat',
      color: 'text-blue-400',
    },
    {
      name: 'Health Stats',
      icon: Activity,
      screen: 'health',
      color: 'text-green-400',
    },
    {
      name: 'Reminders',
      icon: Bell,
      screen: 'reminders',
      color: 'text-yellow-400',
    },
    {
      name: 'Family Circle',
      icon: Users,
      screen: 'family',
      color: 'text-purple-400',
    },
    {
      name: 'Emergency',
      icon: AlertCircle,
      screen: 'emergency',
      color: 'text-red-400',
    },
    {
      name: 'Settings',
      icon: Settings,
      screen: 'settings',
      color: 'text-gray-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Stats Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 bg-card/80 p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:scale-[1.02]">
          <div>
            <h2 className="text-2xl font-semibold">
              Congratulations, {userData.displayName}!
            </h2>
            <p className="text-muted-foreground mt-1">
              You're doing great with your health goals this month.
            </p>
          </div>
          <div className="mt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/20"
              onClick={() => onNavigate('health')}
            >
              View Details
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-card/80 transition-all hover:shadow-xl hover:scale-[1.02]">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-yellow-400" />
                <p>Pending Reminders</p>
              </div>
              <p className="font-bold text-xl">
                {reminders?.filter((r) => !r.completed).length || 0}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <p>Family Members</p>
              </div>
              <p className="font-bold text-xl">{familyMembers?.length || 0}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p>Emergency Contacts</p>
              </div>
              <p className="font-bold text-xl">{contacts?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Card
            key={feature.screen}
            className="p-6 bg-card/80 text-center flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:shadow-xl hover:scale-105 hover:bg-primary/10"
            onClick={() => onNavigate(feature.screen as Screen)}
          >
            <feature.icon className={`w-10 h-10 ${feature.color}`} />
            <p className="text-base font-semibold">{feature.name}</p>
          </Card>
        ))}
      </div>

      {/* Quote Card */}
      <Card className="p-6 bg-card/80 transition-all hover:shadow-xl hover:scale-[1.02]">
        <blockquote className="text-center space-y-2">
          <p className="text-xl italic">"{quote.quote}"</p>
          <footer className="text-sm text-muted-foreground">
            - {quote.author}
          </footer>
        </blockquote>
      </Card>
    </div>
  );
}
