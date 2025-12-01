'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Bell, AlertCircle, Users, Settings, Mic, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import type { User } from '@/firebase/auth/use-user';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { UserData } from '@/firebase/auth/use-user';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

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
  const [quote, setQuote] = useState({ quote: "", author: "" });
  const firestore = useFirestore();

  const carouselImages = [
    getPlaceholderImage('carousel-1'),
    getPlaceholderImage('carousel-2'),
    getPlaceholderImage('carousel-3'),
    getPlaceholderImage('carousel-4')
  ].filter(Boolean) as any[];

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
    { name: "Chat with AI", icon: MessageCircle, screen: "chat", color: "text-blue-400" },
    { name: "Health Stats", icon: Activity, screen: "health", color: "text-green-400" },
    { name: "Reminders", icon: Bell, screen: "reminders", color: "text-yellow-400" },
    { name: "Family Circle", icon: Users, screen: "family", color: "text-purple-400" },
    { name: "Emergency", icon: AlertCircle, screen: "emergency", color: "text-red-400" },
    { name: "Settings", icon: Settings, screen: "settings", color: "text-gray-400" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 space-y-8">
      {/* Header */}
      <header>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {userData.displayName}! Here's your overview.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="space-y-8">
        
        {/* Welcome & Stats Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 bg-card/80 p-6 flex flex-col justify-between">
            <div>
              <p className="text-muted-foreground">{greeting}</p>
              <h2 className="text-2xl font-semibold">Congratulations, {userData.displayName}!</h2>
              <p className="text-muted-foreground mt-1">You're doing great with your health goals this month.</p>
            </div>
            <div className="mt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/20" onClick={() => onNavigate('health')}>View Details</Button>
            </div>
          </Card>
          
          <Card className="p-6 bg-card/80">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <p>Pending Reminders</p>
                </div>
                <p className="font-bold text-xl">{reminders?.filter(r => !r.completed).length || 0}</p>
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

        {/* Carousel */}
        <Carousel className="w-full">
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-64 w-full rounded-2xl overflow-hidden">
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-75"
                    data-ai-hint={image.imageHint}
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute bottom-0 left-0 p-6 text-white">
                      <h3 className="text-2xl font-bold">{image.description}</h3>
                   </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>

        {/* Quote Card */}
        <Card className="p-6 bg-card/80">
            <blockquote className="text-center space-y-2">
                <p className="text-xl italic">"{quote.quote}"</p>
                <footer className="text-sm text-muted-foreground">- {quote.author}</footer>
            </blockquote>
        </Card>
      </main>
    </div>
  );
}
