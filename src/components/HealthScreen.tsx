'use client';
import { useState } from 'react';
import {
  Activity,
  Droplet,
  Heart,
  Plus,
  TrendingUp,
  Wind,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Screen } from '../app/page';
import type { User } from '@/firebase/auth/use-user';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import {
  useCollection,
  useFirestore,
  useMemoFirebase,
  useUser,
} from '@/firebase';
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface HealthRecord {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'oxygen_level';
  value: string;
  timestamp: {
    seconds: number;
    nanoseconds: number;
  };
  status: 'normal' | 'warning' | 'critical';
}

interface HealthScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

export function HealthScreen({ onNavigate, user }: HealthScreenProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const { user: authUser } = useUser();

  const [isLogging, setIsLogging] = useState(false);
  const [newRecord, setNewRecord] = useState({
    bloodPressure: '',
    heartRate: '',
    bloodSugar: '',
    oxygenLevel: '',
  });

  const healthRecordsQuery = useMemoFirebase(() => {
    if (!db || !authUser) return null;
    return query(
      collection(db, 'users', authUser.uid, 'healthRecords'),
      orderBy('timestamp', 'desc')
    );
  }, [db, authUser]);

  const { data: records, isLoading } =
    useCollection<HealthRecord>(healthRecordsQuery);

  const doctorNoteImage = getPlaceholderImage('doctor-note');

  const handleLogVitals = async () => {
    if (!authUser || !db) return;
    const recordsCollection = collection(
      db,
      'users',
      authUser.uid,
      'healthRecords'
    );

    const vitalsToLog = [
      { type: 'blood_pressure', value: newRecord.bloodPressure, status: 'normal' },
      { type: 'heart_rate', value: newRecord.heartRate, status: 'normal' },
      { type: 'blood_sugar', value: newRecord.bloodSugar, status: 'normal' },
      { type: 'oxygen_level', value: newRecord.oxygenLevel, status: 'normal' },
    ];

    let loggedCount = 0;
    for (const vital of vitalsToLog) {
      if (vital.value) {
        await addDoc(recordsCollection, {
          ...vital,
          timestamp: serverTimestamp(),
        });
        loggedCount++;
      }
    }

    if(loggedCount > 0) {
      toast({
        title: 'Vitals Logged',
        description: `Successfully saved ${loggedCount} new health record(s).`,
      });
    }

    setNewRecord({
      bloodPressure: '',
      heartRate: '',
      bloodSugar: '',
      oxygenLevel: '',
    });
    setIsLogging(false);
  };

  const getLatestRecord = (type: HealthRecord['type']) => {
    if (!records) return null;
    return records.find((r) => r.type === type);
  };

  const latestBloodPressure = getLatestRecord('blood_pressure');
  const latestHeartRate = getLatestRecord('heart_rate');
  const latestBloodSugar = getLatestRecord('blood_sugar');
  const latestOxygenLevel = getLatestRecord('oxygen_level');

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Dashboard</h1>
          <p className="text-muted-foreground">
            Your daily health vitals and trends.
          </p>
        </div>
      </header>
      
      <Dialog open={isLogging} onOpenChange={setIsLogging}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full h-14 text-lg">
            <Plus className="w-6 h-6 mr-3" />
            Log Today's Vitals
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Log Health Vitals</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                Blood Pressure (e.g., 120/80)
              </label>
              <Input
                placeholder="120/80"
                value={newRecord.bloodPressure}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, bloodPressure: e.target.value })
                }
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Heart Rate (BPM)
              </label>
              <Input
                placeholder="72"
                value={newRecord.heartRate}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, heartRate: e.target.value })
                }
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplet className="w-4 h-4 text-purple-400" />
                Blood Sugar (mg/dL)
              </label>
              <Input
                placeholder="95"
                value={newRecord.bloodSugar}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, bloodSugar: e.target.value })
                }
                className="h-12 text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Wind className="w-4 h-4 text-cyan-400" />
                Oxygen Level (SpO2 %)
              </label>
              <Input
                placeholder="98"
                value={newRecord.oxygenLevel}
                onChange={(e) =>
                  setNewRecord({ ...newRecord, oxygenLevel: e.target.value })
                }
                className="h-12 text-base"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleLogVitals}
                className="flex-1 h-12"
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
      {/* Current Vitals */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold tracking-tight">Latest Vitals</h3>

        {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-32"/>
                <Skeleton className="h-32"/>
                <Skeleton className="h-32"/>
                <Skeleton className="h-32"/>
            </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {latestBloodPressure && (
              <Card className="p-6 bg-card/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-red-900/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Heart className="w-7 h-7 text-red-400" />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-1">
                        Blood Pressure
                      </p>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {latestBloodPressure.value}
                      </p>
                      <p className="text-sm text-muted-foreground">mmHg</p>
                    </div>
                  </div>
                  <Badge variant="outline">{latestBloodPressure.status}</Badge>
                </div>
              </Card>
            )}

            {latestHeartRate && (
              <Card className="p-6 bg-card/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-900/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-7 h-7 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-1">
                        Heart Rate
                      </p>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {latestHeartRate.value}
                      </p>
                      <p className="text-sm text-muted-foreground">BPM</p>
                    </div>
                  </div>
                  <Badge variant="outline">{latestHeartRate.status}</Badge>
                </div>
              </Card>
            )}

            {latestBloodSugar && (
              <Card className="p-6 bg-card/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-purple-900/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Droplet className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-1">
                        Blood Sugar
                      </p>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {latestBloodSugar.value}
                      </p>
                      <p className="text-sm text-muted-foreground">mg/dL</p>
                    </div>
                  </div>
                  <Badge variant="outline">{latestBloodSugar.status}</Badge>
                </div>
              </Card>
            )}

            {latestOxygenLevel && (
              <Card className="p-6 bg-card/60">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-cyan-900/40 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Wind className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-1">
                        Oxygen Level
                      </p>
                      <p className="text-3xl font-bold text-foreground mb-1">
                        {latestOxygenLevel.value}
                      </p>
                      <p className="text-sm text-muted-foreground">SpO2 %</p>
                    </div>
                  </div>
                  <Badge variant="outline">{latestOxygenLevel.status}</Badge>
                </div>
              </Card>
            )}
             {!records?.length && !isLoading && (
              <Card className="p-12 text-center bg-card/60 md:col-span-2">
                <Activity className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-xl text-muted-foreground">
                  No health vitals logged yet.
                </p>
                <p className="text-base text-muted-foreground/80 mt-2">
                  Click "Log Today's Vitals" to get started.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
            <CardTitle className='flex items-center gap-3'>
                 <TrendingUp className="w-6 h-6 text-primary" />
                 7-Day Trend
            </CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Your vitals have been stable and within normal ranges over the past week. Keep up the great work with your health routine! (Chart coming soon).</p>
        </CardContent>
      </Card>

      {doctorNoteImage && (
        <Card className="p-6 bg-card/60 border-primary/20">
          <div className="flex items-start gap-4">
            <Image
              src={doctorNoteImage.imageUrl}
              alt={doctorNoteImage.description}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              data-ai-hint={doctorNoteImage.imageHint}
            />
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Note from Dr. Smith</h4>
              <p className="text-base text-muted-foreground">
                "Your recent checkup results are excellent. Continue monitoring
                your blood pressure daily and maintain your current medication
                schedule. Remember to take it easy and get plenty of rest. See
                you at your next appointment on November 25th."
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
