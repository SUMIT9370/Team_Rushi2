'use client';
import { useState } from 'react';
import { Phone, MessageCircle, Plus, Trash2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from './ui/dialog';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import type { User } from '@/firebase/auth/use-user';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  phone: string;
}

interface FamilyConnectScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

export function FamilyConnectScreen({
  onNavigate,
  user,
}: FamilyConnectScreenProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const familyMembersQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'familyMembers');
  }, [db, user]);

  const { data: familyMembers, isLoading } =
    useCollection<FamilyMember>(familyMembersQuery);

  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relation: '',
    phone: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddMember = async () => {
    if (
      !familyMembersQuery ||
      !newMember.name ||
      !newMember.relation ||
      !newMember.phone
    ) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields.',
      });
      return;
    }
    
    setIsUploading(true);
    let avatarDataUrl = 'https://picsum.photos/seed/defaultavatar/200/200'; // Default placeholder

    if (avatarFile) {
      try {
        avatarDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(avatarFile);
        });
      } catch (error) {
        console.error('Error converting file to Base64:', error);
        toast({
          variant: 'destructive',
          title: 'Processing Failed',
          description: 'Could not process the image file.',
        });
        setIsUploading(false);
        return;
      }
    }

    try {
      await addDoc(familyMembersQuery, {
        ...newMember,
        avatar: avatarDataUrl,
        createdAt: serverTimestamp(),
      });
      setNewMember({ name: '', relation: '', phone: '' });
      setAvatarFile(null);
      setIsAdding(false);
      toast({
        title: 'Family Member Added',
        description: `${newMember.name} has been added to your circle.`,
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save the new family member.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (db && user) {
      await deleteDoc(doc(db, 'users', user.uid, 'familyMembers', id));
      toast({ title: 'Family Member Removed' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Circle</h1>
          <p className="text-muted-foreground">
            Stay connected with your loved ones.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Family Members</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                {familyMembers?.length || 0} members in your circle.
              </p>
            </div>
            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    Add Family Member
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <Input
                      placeholder="Enter name"
                      value={newMember.name}
                      onChange={(e) =>
                        setNewMember({ ...newMember, name: e.target.value })
                      }
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Relation
                    </label>
                    <Input
                      placeholder="e.g., Son, Grandchild"
                      value={newMember.relation}
                      onChange={(e) =>
                        setNewMember({
                          ...newMember,
                          relation: e.target.value,
                        })
                      }
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone Number
                    </label>
                    <Input
                      placeholder="Enter phone number"
                      value={newMember.phone}
                      onChange={(e) =>
                        setNewMember({ ...newMember, phone: e.target.value })
                      }
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Photo (Optional)
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setAvatarFile(e.target.files?.[0] || null)
                      }
                      className="h-12 text-base file:text-foreground"
                    />
                  </div>
                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                       <Button variant="outline" className="flex-1 h-12">Cancel</Button>
                    </DialogClose>
                     <Button
                      onClick={handleAddMember}
                      disabled={isUploading}
                      className="flex-1 h-12"
                    >
                      {isUploading ? 'Saving...' : 'Add Member'}
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && (
            <div className="grid md:grid-cols-2 gap-4">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
            </div>
          )}

          {!isLoading && familyMembers?.length === 0 && (
            <div className="py-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground">
                Your family circle is empty.
              </p>
              <p className="text-base text-muted-foreground/80 mt-2">
                Add your family members to get started.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {familyMembers?.map((member) => (
              <Card
                key={member.id}
                className="p-4 bg-card/60 transition-all hover:shadow-lg hover:scale-[1.02] hover:bg-primary/10"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground">
                        {member.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {member.relation}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {member.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="h-10 bg-blue-500 hover:bg-blue-600 rounded-lg flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-10 rounded-lg flex-1"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-full text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove {member.name} from your family circle. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
