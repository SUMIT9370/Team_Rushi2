'use client';
import { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Plus, Trash2, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
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
import type { User } from '@/firebase/auth/use-user';
import {
  useUser,
  useCollection,
  useFirestore,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

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
      familyMembersQuery &&
      newMember.name &&
      newMember.relation &&
      newMember.phone
    ) {
      let avatarUrl = 'https://picsum.photos/seed/defaultavatar/200/200'; // Default placeholder
      
      if (avatarFile) {
        setIsUploading(true);
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/family/${user.uid}/${Date.now()}_${avatarFile.name}`);
        try {
          const snapshot = await uploadBytes(storageRef, avatarFile);
          avatarUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Error uploading avatar:", error);
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "Could not upload the avatar image.",
          });
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      await addDoc(familyMembersQuery, {
        ...newMember,
        avatar: avatarUrl,
        createdAt: serverTimestamp(),
      });
      setNewMember({ name: '', relation: '', phone: '' });
      setAvatarFile(null);
      setIsAdding(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (db && user) {
      await deleteDoc(doc(db, 'users', user.uid, 'familyMembers', id));
    }
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
            <div className="flex items-center gap-3 flex-1">
              <Users className="w-8 h-8" />
              <h2 className="text-2xl">Family Connect</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-gray-900">Your Family Circle</h3>
              <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
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
                      <label className="text-base">Name</label>
                      <Input
                        placeholder="Enter name"
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember({ ...newMember, name: e.target.value })
                        }
                        className="h-12 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-base">Relation</label>
                      <Input
                        placeholder="e.g., Son, Daughter, Grandchild"
                        value={newMember.relation}
                        onChange={(e) =>
                          setNewMember({
                            ...newMember,
                            relation: e.target.value,
                          })
                        }
                        className="h-12 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-base">Phone Number</label>
                      <Input
                        placeholder="Enter phone number"
                        value={newMember.phone}
                        onChange={(e) =>
                          setNewMember({ ...newMember, phone: e.target.value })
                        }
                        className="h-12 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-base">Photo (Optional)</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        className="h-12 text-lg"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddMember}
                        disabled={
                          !newMember.name ||
                          !newMember.relation ||
                          !newMember.phone ||
                          isUploading
                        }
                        className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                      >
                        {isUploading ? "Uploading..." : "Add Member"}
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
            </div>

            {isLoading && <p>Loading family members...</p>}

            {!isLoading && familyMembers?.length === 0 && (
              <Card className="p-12 text-center bg-white">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-xl text-gray-500">
                  No family members added yet.
                </p>
                <p className="text-base text-gray-400 mt-2">
                  Add your family members to get started.
                </p>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {familyMembers?.map((member) => (
                <Card
                  key={member.id}
                  className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <ImageWithFallback
                        src={member.avatar}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="text-xl text-gray-900">{member.name}</h4>
                        <p className="text-base text-gray-600">
                          {member.relation}
                        </p>
                        <p className="text-base text-gray-500">
                          {member.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="h-10 bg-blue-500 hover:bg-blue-600 rounded-xl flex-1">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl flex-1"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        onClick={() => handleDeleteMember(member.id)}
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
