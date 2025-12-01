'use client';
import { useState, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  Type,
  Moon,
  Globe,
  Users,
  Shield,
  Bell,
  LogOut,
  Edit,
  Upload,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import { useUser, type User, useFirestore } from '@/firebase';
import { signOut } from '@/firebase/auth/signout';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

export function SettingsScreen({ onNavigate, user }: SettingsScreenProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    highContrast: false,
    medicineReminders: true,
    familyMessages: true,
    voiceSpeed: 'normal',
    textSize: 'large',
    language: 'English',
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user.displayName || '',
  });
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await signOut();
      // The useUser hook will handle navigation back to login screen
    }
  };

  const handleUpdateProfile = async () => {
    if (profileData.displayName && firestore && user) {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: profileData.displayName,
      });
      await updateProfile(user, { displayName: profileData.displayName });
      setIsEditingProfile(false);
      toast({
        title: 'Profile Updated',
        description: 'Your display name has been updated.',
      });
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;

        if (user && firestore) {
            // This is a workaround to trigger onAuthStateChanged
            await updateProfile(user, { photoURL: `updated_at_${Date.now()}` });
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, { photoURL: dataUrl });
        }


        toast({
          title: 'Avatar Updated',
          description: 'Your profile picture has been changed.',
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an error processing your new avatar.',
      });
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-700 to-gray-700 text-white shadow-lg">
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
              <Shield className="w-8 h-8" />
              <h2 className="text-2xl">Settings</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Profile Section */}
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center gap-6">
              <div className="relative">
                <ImageWithFallback
                  src={user.photoURL || undefined}
                  alt={user.displayName || 'user'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl text-gray-900 mb-1">
                  {user.displayName}
                </h3>
                <p className="text-lg text-gray-600 mb-3">{user.email}</p>
                <Dialog
                  open={isEditingProfile}
                  onOpenChange={setIsEditingProfile}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <label className="text-base">Name</label>
                        <Input
                          value={profileData.displayName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              displayName: e.target.value,
                            })
                          }
                          className="h-12 text-lg"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleUpdateProfile}
                          className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                        >
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => setIsEditingProfile(false)}
                          variant="outline"
                          className="flex-1 h-12"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>

          {/* Display Settings */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-900">Display & Accessibility</h3>

            <Card className="p-6 bg-white shadow-md">
              <div className="space-y-6">
                {/* Text Size */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Type className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg text-gray-900">Text Size</p>
                      <p className="text-base text-gray-600">
                        Currently: {settings.textSize}
                      </p>
                    </div>
                  </div>
                  <select
                    value={settings.textSize}
                    onChange={(e) =>
                      setSettings({ ...settings, textSize: e.target.value })
                    }
                    className="h-12 px-4 text-base border-2 rounded-xl"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Moon className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg text-gray-900">High Contrast Mode</p>
                      <p className="text-base text-gray-600">Easier to read</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, highContrast: checked })
                    }
                  />
                </div>

                {/* Voice Speed */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Volume2 className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg text-gray-900">Voice Speed</p>
                      <p className="text-base text-gray-600">
                        Currently: {settings.voiceSpeed}
                      </p>
                    </div>
                  </div>
                  <select
                    value={settings.voiceSpeed}
                    onChange={(e) =>
                      setSettings({ ...settings, voiceSpeed: e.target.value })
                    }
                    className="h-12 px-4 text-base border-2 rounded-xl"
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>

          {/* Language Settings */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-900">Language</h3>

            <Card className="p-6 bg-white shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-900">App Language</p>
                    <p className="text-base text-gray-600">
                      Currently: {settings.language}
                    </p>
                  </div>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) =>
                    setSettings({ ...settings, language: e.target.value })
                  }
                  className="h-12 px-4 text-base border-2 rounded-xl"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español</option>
                  <option value="French">Français</option>
                  <option value="German">Deutsch</option>
                  <option value="Hindi">हिन्दी</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-900">Notifications</h3>

            <Card className="p-6 bg-white shadow-md">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-7 h-7 text-red-600" />
                    </div>
                    <div>
                      <p className="text-lg text-gray-900">
                        Medicine Reminders
                      </p>
                      <p className="text-base text-gray-600">Sound + Vibration</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.medicineReminders}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, medicineReminders: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Bell className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-lg text-gray-900">Family Messages</p>
                      <p className="text-base text-gray-600">Instant alerts</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings.familyMessages}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, familyMessages: checked })
                    }
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-900">Emergency</h3>

            <Card className="p-6 bg-white shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-red-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-900">Emergency Contacts</p>
                    <p className="text-base text-gray-600">Manage your contacts</p>
                  </div>
                </div>
                <Button
                  onClick={() => onNavigate('emergency')}
                  className="h-12 px-6 bg-red-500 hover:bg-red-600 rounded-xl"
                >
                  Manage
                </Button>
              </div>
            </Card>
          </div>

          {/* Privacy & Security */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl text-green-900 mb-3">
                  Privacy & Security
                </h3>
                <div className="space-y-2 text-base text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🔒</span>
                    <span>Your data is encrypted and secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">👨‍👩‍👧</span>
                    <span>Family-controlled access only</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🚫</span>
                    <span>No unnecessary data collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✅</span>
                    <span>Privacy-first design</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Help & Support */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-xl text-blue-900 mb-3">Need Help?</h3>
            <p className="text-base text-gray-700 mb-4">
              If you need assistance with any settings or have questions, our
              support team is here to help you 24/7.
            </p>
            <div className="flex gap-3">
              <Button className="flex-1 h-14 bg-blue-600 hover:bg-blue-700 rounded-xl">
                Contact Support
              </Button>
              <Button
                onClick={() => onNavigate('chat')}
                variant="outline"
                className="flex-1 h-14 rounded-xl border-2"
              >
                Chat with MITRAM
              </Button>
            </div>
          </Card>

          {/* Logout */}
          <Card className="p-6 bg-white shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-7 h-7 text-gray-600" />
                </div>
                <div>
                  <p className="text-lg text-gray-900">Logout</p>
                  <p className="text-base text-gray-600">
                    Sign out of your account
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="h-12 px-6 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
              >
                Logout
              </Button>
            </div>
          </Card>

          {/* App Info */}
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">MITRAM v1.0.0</p>
            <p className="text-sm">Your trusted digital companion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
