
'use client';
import { useState } from 'react';
import { ArrowLeft, Pill, Calendar, Droplet, Plus, Check, Clock, Trash2, Bell } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Screen } from '../app/page';
import type { User } from '@/firebase/auth/use-user';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';


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
  emoji: string;
}

export function RemindersScreen({ onNavigate, user }: RemindersScreenProps) {
  const db = useFirestore();
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
      const reminder: Omit<Reminder, 'id'> = {
        type: newReminder.type,
        title: newReminder.title,
        time: newReminder.time,
        description: newReminder.description,
        completed: false,
        emoji: newReminder.type === 'medicine' ? '💊' : newReminder.type === 'water' ? '💧' : newReminder.type === 'doctor' ? '🏥' : '📝'
      };
      const remindersCollection = collection(db, 'users', user.uid, 'reminders');
      await addDoc(remindersCollection, reminder);
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
  const pendingCount = reminders?.filter(r => !r.completed).length || 0;
  const totalCount = reminders?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('home')}
              variant="ghost"
              className="text-white hover:bg-white/20 h-12 w-12 rounded-full p-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3 flex-1">
              <Bell className="w-8 h-8" />
              <h2 className="text-2xl">My Reminders</h2>
            </div>
            {pendingCount > 0 && (
              <Badge className="bg-white/20 text-white border-0 text-base px-4 py-2">
                {pendingCount} Pending
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Daily Summary */}
          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl text-gray-900 mb-1">Today's Progress</h3>
                <p className="text-lg text-gray-600">
                  {completedCount} of {totalCount} tasks completed
                </p>
              </div>
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl text-gray-900">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-500 text-white border-0 shadow-md">
              <Pill className="w-7 h-7 mb-2" />
              <p className="text-2xl">
                {reminders?.filter(r => r.type === 'medicine').length || 0}
              </p>
              <p className="text-sm opacity-90">Medicines</p>
            </Card>
            <Card className="p-4 bg-cyan-500 text-white border-0 shadow-md">
              <Droplet className="w-7 h-7 mb-2" />
              <p className="text-2xl">
                {reminders?.filter(r => r.type === 'water').length || 0}
              </p>
              <p className="text-sm opacity-90">Water</p>
            </Card>
            <Card className="p-4 bg-red-500 text-white border-0 shadow-md">
              <Calendar className="w-7 h-7 mb-2" />
              <p className="text-2xl">
                {reminders?.filter(r => r.type === 'doctor').length || 0}
              </p>
              <p className="text-sm opacity-90">Appointments</p>
            </Card>
          </div>

          {/* Add Reminder Button */}
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button className="w-full h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl shadow-lg">
                <Plus className="w-6 h-6 mr-3" />
                <span className="text-lg">Add New Reminder</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">Create Reminder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-base">Title</label>
                  <Input
                    placeholder="e.g., Take Medicine"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-base">Time</label>
                  <Input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-base">Type</label>
                  <select
                    value={newReminder.type}
                    onChange={(e) => setNewReminder({ ...newReminder, type: e.target.value as any })}
                    className="w-full h-12 text-lg border-2 rounded-xl px-4"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="doctor">Doctor Appointment</option>
                    <option value="water">Water</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-base">Description (Optional)</label>
                  <Input
                    placeholder="Additional details"
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                    className="h-12 text-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddReminder}
                    disabled={!newReminder.title || !newReminder.time}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700"
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
            <h3 className="text-2xl text-gray-900">Today's Schedule</h3>
            {isLoading && <p>Loading reminders...</p>}
            {!isLoading && reminders?.length === 0 ? (
              <Card className="p-12 text-center bg-white">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">No reminders yet</p>
                <p className="text-base text-gray-400 mt-2">Add your first reminder to get started</p>
              </Card>
            ) : (
              reminders?.map((reminder) => (
                <Card
                  key={reminder.id}
                  className={`p-6 shadow-md transition-all hover:shadow-lg ${
                    reminder.completed ? 'opacity-60 bg-gray-50' : 'bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Emoji Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${getTypeColor(reminder.type)} rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl`}>
                      {reminder.emoji}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xl text-gray-900 mb-1 ${reminder.completed ? 'line-through' : ''}`}>
                            {reminder.title}
                          </h4>
                          <Badge className="text-base bg-gray-100 text-gray-700 border-0">
                            <Clock className="w-4 h-4 mr-1" />
                            {reminder.time}
                          </Badge>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            onClick={() => toggleReminder(reminder.id, reminder.completed)}
                            className={`h-12 w-12 rounded-full ${
                              reminder.completed
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                          >
                            <Check className="w-6 h-6" />
                          </Button>
                          <Button
                            onClick={() => deleteReminder(reminder.id)}
                            variant="outline"
                            className="h-12 w-12 rounded-full border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                      {reminder.description && (
                        <p className="text-base text-gray-600">{reminder.description}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Helpful Tips */}
          <Card className="p-6 bg-green-50 border-green-200">
            <h3 className="text-xl text-green-900 mb-4">💡 Reminder Tips</h3>
            <ul className="space-y-2 text-base text-gray-700">
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Take medicines with water or food as prescribed</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Mark tasks as complete after finishing them</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Set reminders 15 minutes before important tasks</span>
              </li>
              <li className="flex gap-2">
                <span className="text-green-600">•</span>
                <span>Use voice commands: "Hey MITRAM, remind me..."</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
