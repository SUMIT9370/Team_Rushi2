'use client';
import { useState, useEffect } from 'react';
import { Pill, Calendar, Droplet, Plus, Check, Clock, Trash2, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Screen } from '../app/page';
import type { User } from '@/firebase/auth/use-user';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { sendReminderEmail } from '@/lib/email';


interface RemindersScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

interface Reminder {
  id: string;
  type: 'medicine' | 'doctor' | 'water' | 'other';
  title: string;
  time: string;
  description?: string;
  completed: boolean;
  notified: boolean;
  emoji: string;
}

export function RemindersScreen({ onNavigate, user }: RemindersScreenProps) {
  const db = useFirestore();
  const { toast } = useToast();

  const remindersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'reminders'), orderBy('time'));
  }, [db, user]);

  const { data: reminders, isLoading } = useCollection<Reminder>(remindersQuery);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    description: '',
    type: 'other' as const
  });

  // Reminder clock effect
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      reminders?.forEach(async (reminder) => {
        if (reminder.time === currentTime && !reminder.completed && !reminder.notified) {
          
          // Trigger toast notification
          toast({
            title: `🔔 Reminder: ${reminder.title}`,
            description: reminder.description || `It's time for your reminder at ${reminder.time}.`,
            duration: 10000,
          });

          // Trigger email
          if (user.email) {
            sendReminderEmail(user.email, reminder.title, reminder.description || `This is a reminder for ${reminder.title} at ${reminder.time}.`);
          }
          
          // Mark as notified to prevent re-triggering
          if(db && user) {
            const reminderDoc = doc(db, 'users', user.uid, 'reminders', reminder.id);
            await updateDoc(reminderDoc, { notified: true });
          }
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [reminders, user, db, toast]);


  const toggleReminder = async (id: string, currentStatus: boolean) => {
    if (db && user) {
        const reminderDoc = doc(db, 'users', user.uid, 'reminders', id);
        await updateDoc(reminderDoc, { completed: !currentStatus });
    }
  };

  const deleteReminder = async (id: string) => {
    if (db && user) {
        const reminderDoc = doc(db, 'users', user.uid, 'reminders', id);
        await deleteDoc(reminderDoc);
    }
  };

  const handleAddReminder = async () => {
    if (db && user && newReminder.title && newReminder.time) {
      const reminderData = {
        type: newReminder.type,
        title: newReminder.title,
        time: newReminder.time,
        description: newReminder.description,
        completed: false,
        notified: false,
        createdAt: serverTimestamp(),
        emoji: newReminder.type === 'medicine' ? '💊' : newReminder.type === 'water' ? '💧' : newReminder.type === 'doctor' ? '🏥' : '📝'
      };
      const remindersCollection = collection(db, 'users', user.uid, 'reminders');
      await addDoc(remindersCollection, reminderData);
      setNewReminder({ title: '', time: '', description: '', type: 'other' });
      setIsAdding(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medicine':
        return 'from-blue-500 to-indigo-600';
      case 'doctor':
        return 'from-red-500 to-rose-600';
      case 'water':
        return 'from-cyan-500 to-blue-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const completedCount = reminders?.filter(r => r.completed).length || 0;
  const totalCount = reminders?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-8">
      {/* Header */}
      <header>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">Your daily schedule and tasks.</p>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Daily Summary */}
        <Card>
            <CardHeader>
                <CardTitle>Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <p className="text-lg text-muted-foreground">
                        {completedCount} of {totalCount} tasks completed
                    </p>
                    <div className="w-20 h-20 bg-card/60 rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-2xl font-semibold text-foreground">
                        {Math.round(progress)}%
                        </span>
                    </div>
                </div>
                <div className="mt-4 h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </CardContent>
        </Card>
        
        {/* Add Reminder Button */}
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full h-14 text-lg">
                    <Plus className="w-6 h-6 mr-3" />
                    <span>Add New Reminder</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Create Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <Input
                    placeholder="e.g., Take Medicine"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Time</label>
                  <Input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Type</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                    className="w-full h-12 text-base border-2 rounded-lg px-4 bg-secondary border-border"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="doctor">Doctor Appointment</option>
                    <option value="water">Water</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Description (Optional)</label>
                  <Input
                    placeholder="Additional details"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    className="h-12 text-base"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleAddReminder}
                    disabled={!newReminder.title || !newReminder.time}
                    className="flex-1 h-12"
                  >
                    Add Reminder
                  </Button>
                  <Button
                    onClick={() => setIsAdding(false)}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        {/* Reminders List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight text-foreground">Today's Schedule</h3>
          {isLoading && <p className="text-muted-foreground text-center py-8">Loading reminders...</p>}
          {!isLoading && reminders?.length === 0 ? (
            <Card className="p-12 text-center bg-card/60">
              <Bell className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">No reminders for today</p>
              <p className="text-base text-muted-foreground/80 mt-2">Add your first reminder to get started.</p>
            </Card>
          ) : (
            reminders?.map((reminder) => (
              <Card
                key={reminder.id}
                className={`p-4 shadow-md transition-all hover:shadow-lg bg-card/60 ${
                  reminder.completed ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Emoji Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${getTypeColor(reminder.type)} rounded-xl flex items-center justify-center flex-shrink-0 text-3xl`}>
                    {reminder.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-lg font-semibold text-foreground ${reminder.completed ? 'line-through' : ''}`}>
                      {reminder.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {reminder.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 text-right">
                    <Badge variant="secondary" className="text-sm">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {reminder.time}
                    </Badge>
                     <div className="flex items-center gap-1">
                        <Button
                            onClick={() => toggleReminder(reminder.id, reminder.completed)}
                            variant={reminder.completed ? "default" : "secondary"}
                            size="icon"
                            className={`h-9 w-9 rounded-full ${reminder.completed ? 'bg-green-500 hover:bg-green-600' : ''}`}
                        >
                            <Check className="w-5 h-5" />
                        </Button>
                        <Button
                            onClick={() => deleteReminder(reminder.id)}
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                            <Trash2 className="w-5 h-5" />
                        </Button>
                     </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
