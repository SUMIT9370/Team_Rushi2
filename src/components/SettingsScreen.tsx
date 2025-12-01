'use client';
import { useState, useRef } from 'react';
import {
  LogOut,
  Edit,
  Upload,
  User as UserIcon,
  Palette,
  Bell,
  Languages,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
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
import { useUser, type User, useFirestore, type UserData } from '@/firebase';
import { signOut } from '@/firebase/auth/signout';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
  userData: UserData;
}

export function SettingsScreen({ onNavigate, user, userData }: SettingsScreenProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-8">
      {/* Header */}
      <header>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5"/> Profile
            </CardTitle>
            <CardDescription>This is your personal information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <ImageWithFallback
                  src={userData.photoURL || undefined}
                  alt={userData.displayName || 'user'}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
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
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  title="Upload new avatar"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-1">
                  {userData.displayName}
                </h3>
                <p className="text-lg text-muted-foreground mb-3">{user.email}</p>
                <Dialog
                  open={isEditingProfile}
                  onOpenChange={setIsEditingProfile}
                >
                  <DialogTrigger asChild>
                    <Button variant="secondary">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={profileData.displayName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              displayName: e.target.value,
                            })
                          }
                          className="h-12 text-base"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleUpdateProfile}
                          className="flex-1 h-12"
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
          </CardContent>
        </Card>

        {/* Display & Accessibility */}
        <Card>
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5"/> Display & Accessibility
              </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/60">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <Switch id="dark-mode" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/60">
              <Label htmlFor="high-contrast" className="text-base">High Contrast</Label>
              <Switch id="high-contrast" />
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5"/> Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/60">
              <Label htmlFor="medicine-reminders" className="text-base">Medicine Reminders</Label>
              <Switch id="medicine-reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/60">
              <Label htmlFor="family-messages" className="text-base">Family Messages</Label>
              <Switch id="family-messages" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Other Sections */}
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Languages className="w-5 h-5"/> Language</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Current language: English</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5"/> Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                 <Button variant="secondary">Manage Data</Button>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LifeBuoy className="w-5 h-5"/> Support</CardTitle>
              </CardHeader>
              <CardContent>
                 <Button variant="secondary">Contact Us</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><LogOut className="w-5 h-5"/> Logout</CardTitle>
              </CardHeader>
              <CardContent>
                 <Button variant="destructive" onClick={handleLogout}>Sign Out</Button>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
