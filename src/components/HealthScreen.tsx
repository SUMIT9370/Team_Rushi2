'use client';
import { useState } from 'react';
import { ArrowLeft, Activity, Heart, Droplet, Wind, TrendingUp, Calendar, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import type { User } from '@/firebase/auth/use-user';

interface HealthScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

interface HealthRecord {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'weight' | 'temperature';
  value: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export function HealthScreen({ onNavigate, user }: HealthScreenProps) {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  const [isLogging, setIsLogging] = useState(false);
  const [newRecord, setNewRecord] = useState({
    bloodPressure: '',
    heartRate: '',
    bloodSugar: '',
    weight: ''
  });

  const healthScore = 0; // Set to 0 as there is no data

  const handleLogVitals = () => {
    // In a real app, this would save to a database.
    // Here we just add to the local state.
    const newRecords: HealthRecord[] = [];
    if (newRecord.bloodPressure) {
      newRecords.push({
        id: `bp-${Date.now()}`,
        type: 'blood_pressure',
        value: newRecord.bloodPressure,
        timestamp: new Date(),
        status: 'normal' // In a real app, logic would determine this
      });
    }
    if (newRecord.heartRate) {
      newRecords.push({
        id: `hr-${Date.now()}`,
        type: 'heart_rate',
        value: newRecord.heartRate,
        timestamp: new Date(),
        status: 'normal'
      });
    }
     if (newRecord.bloodSugar) {
      newRecords.push({
        id: `bs-${Date.now()}`,
        type: 'blood_sugar',
        value: newRecord.bloodSugar,
        timestamp: new Date(),
        status: 'normal'
      });
    }
    setRecords(prev => [...prev, ...newRecords]);
    setNewRecord({ bloodPressure: '', heartRate: '', bloodSugar: '', weight: '' });
    setIsLogging(false);
  };

  const getLatestRecord = (type: HealthRecord['type']) => {
    return records.filter(r => r.type === type).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
  }

  const latestBloodPressure = getLatestRecord('blood_pressure');
  const latestHeartRate = getLatestRecord('heart_rate');
  const latestBloodSugar = getLatestRecord('blood_sugar');


  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onNavigate('home')}
              variant="ghost"
              className="text-white hover:bg-white/20 h-12 w-12 rounded-full p-0"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8" />
              <h2 className="text-2xl">Health Tracker</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          
          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4">
            <Dialog open={isLogging} onOpenChange={setIsLogging}>
              <DialogTrigger asChild>
                <Button className="h-20 bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md">
                  <Plus className="w-6 h-6 mr-3" />
                  <span className="text-lg">Log Today's Vitals</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Log Health Vitals</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-base flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Blood Pressure (e.g., 120/80)
                    </label>
                    <Input
                      placeholder="120/80"
                      value={newRecord.bloodPressure}
                      onChange={(e) => setNewRecord({ ...newRecord, bloodPressure: e.target.value })}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      Heart Rate (BPM)
                    </label>
                    <Input
                      placeholder="72"
                      value={newRecord.heartRate}
                      onChange={(e) => setNewRecord({ ...newRecord, heartRate: e.target.value })}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-purple-500" />
                      Blood Sugar (mg/dL)
                    </label>
                    <Input
                      placeholder="95"
                      value={newRecord.bloodSugar}
                      onChange={(e) => setNewRecord({ ...newRecord, bloodSugar: e.target.value })}
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleLogVitals}
                      className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                    >
                      Save Vitals
                    </Button>
                    <Button
                      onClick={() => setIsLogging(false)}
                      variant="outline"
                      className="flex-1 h-12"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="h-20 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md">
              <Calendar className="w-6 h-6 mr-3" />
              <span className="text-lg">View History</span>
            </Button>
          </div>

          {/* Current Vitals */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-900">Today's Vitals</h3>
            
            {records.length === 0 ? <Card className='p-6 text-center text-gray-500 bg-white'>No vitals logged yet.</Card> : (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Blood Pressure */}
              { latestBloodPressure && (
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">Blood Pressure</p>
                      <p className="text-3xl text-gray-900 mb-1">{latestBloodPressure.value}</p>
                      <p className="text-sm text-gray-500">mmHg</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">{latestBloodPressure.status}</Badge>
                </div>
              </Card>
              )}

              {/* Heart Rate */}
              { latestHeartRate && (
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">Heart Rate</p>
                      <p className="text-3xl text-gray-900 mb-1">{latestHeartRate.value}</p>
                      <p className="text-sm text-gray-500">BPM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">{latestHeartRate.status}</Badge>
                </div>
              </Card>
              )}

              {/* Blood Sugar */}
              { latestBloodSugar && (
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Droplet className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">Blood Sugar</p>
                      <p className="text-3xl text-gray-900 mb-1">{latestBloodSugar.value}</p>
                      <p className="text-sm text-gray-500">mg/dL</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">{latestBloodSugar.status}</Badge>
                </div>
              </Card>
              )}
            </div>
            )}
          </div>


          {/* Health Tips */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-xl text-blue-900 mb-4">💡 Health Tips for Today</h3>
            <ul className="space-y-3 text-base text-gray-700">
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <span>Remember to take any prescribed medication on time.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <span>Stay hydrated - aim for 8 glasses of water today</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <span>Consider a short 15-minute walk if you are feeling up to it.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
