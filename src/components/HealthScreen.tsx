import { useState } from 'react';
import { ArrowLeft, Activity, Heart, Droplet, Wind, TrendingUp, Calendar, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Screen, User } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';

interface HealthScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

interface HealthRecord {
  id: number;
  type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'weight' | 'temperature';
  value: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

export function HealthScreen({ onNavigate, user }: HealthScreenProps) {
  const [records, setRecords] = useState<HealthRecord[]>([
    {
      id: 1,
      type: 'blood_pressure',
      value: '120/80',
      timestamp: new Date(),
      status: 'normal'
    },
    {
      id: 2,
      type: 'heart_rate',
      value: '72',
      timestamp: new Date(),
      status: 'normal'
    },
    {
      id: 3,
      type: 'blood_sugar',
      value: '95',
      timestamp: new Date(),
      status: 'normal'
    }
  ]);

  const [isLogging, setIsLogging] = useState(false);
  const [newRecord, setNewRecord] = useState({
    bloodPressure: '',
    heartRate: '',
    bloodSugar: '',
    weight: ''
  });

  const healthScore = 98;

  const handleLogVitals = () => {
    // Add new records
    if (newRecord.bloodPressure) {
      setRecords(prev => [...prev, {
        id: Date.now(),
        type: 'blood_pressure',
        value: newRecord.bloodPressure,
        timestamp: new Date(),
        status: 'normal'
      }]);
    }
    if (newRecord.heartRate) {
      setRecords(prev => [...prev, {
        id: Date.now() + 1,
        type: 'heart_rate',
        value: newRecord.heartRate,
        timestamp: new Date(),
        status: 'normal'
      }]);
    }
    setNewRecord({ bloodPressure: '', heartRate: '', bloodSugar: '', weight: '' });
    setIsLogging(false);
  };

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
          {/* Health Score Card */}
          <Card className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg opacity-90 mb-2">Your Health Score</p>
                <h3 className="text-6xl mb-2">{healthScore}%</h3>
                <p className="text-lg opacity-90">Excellent condition! Keep it up!</p>
              </div>
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="w-16 h-16" />
              </div>
            </div>
          </Card>

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
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Blood Pressure */}
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">Blood Pressure</p>
                      <p className="text-3xl text-gray-900 mb-1">120/80</p>
                      <p className="text-sm text-gray-500">mmHg</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">Normal</Badge>
                </div>
              </Card>

              {/* Heart Rate */}
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">Heart Rate</p>
                      <p className="text-3xl text-gray-900 mb-1">72</p>
                      <p className="text-sm text-gray-500">BPM</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">Normal</Badge>
                </div>
              </Card>

              {/* Blood Sugar */}
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Droplet className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">Blood Sugar</p>
                      <p className="text-3xl text-gray-900 mb-1">95</p>
                      <p className="text-sm text-gray-500">mg/dL</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">Normal</Badge>
                </div>
              </Card>

              {/* Oxygen Level */}
              <Card className="p-6 bg-white shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Wind className="w-7 h-7 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-base text-gray-600 mb-1">Oxygen Level</p>
                      <p className="text-3xl text-gray-900 mb-1">98</p>
                      <p className="text-sm text-gray-500">SpO2 %</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0">Normal</Badge>
                </div>
              </Card>
            </div>
          </div>

          {/* Weekly Trend */}
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-xl text-gray-900">7-Day Trend</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="text-base text-gray-700">Blood Pressure</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-base text-green-700">Stable</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="text-base text-gray-700">Heart Rate</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-base text-green-700">Improving</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="text-base text-gray-700">Blood Sugar</span>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-base text-green-700">Stable</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Health Tips */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <h3 className="text-xl text-blue-900 mb-4">💡 Health Tips for Today</h3>
            <ul className="space-y-3 text-base text-gray-700">
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <span>Your vitals are looking great! Keep up the good work</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <span>Remember to take your evening medication at 6:00 PM</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <span>Stay hydrated - aim for 8 glasses of water today</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600">✓</span>
                <span>Consider a short 15-minute walk after lunch</span>
              </li>
            </ul>
          </Card>

          {/* Doctor's Note */}
          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-start gap-4">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1666886573452-9dc8ce8f5cc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwbWVkaWNhbHxlbnwxfHx8fDE3NjM4NjU1MzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Healthcare"
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <h4 className="text-lg text-gray-900 mb-2">Note from Dr. Smith</h4>
                <p className="text-base text-gray-700">
                  "Your recent checkup results are excellent. Continue monitoring your blood pressure daily and maintain your current medication schedule. See you at your next appointment on November 25th."
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
