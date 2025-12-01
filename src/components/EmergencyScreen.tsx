'use client';
import { useState } from 'react';
import {
  ArrowLeft,
  AlertCircle,
  Phone,
  MapPin,
  Plus,
  Trash2,
  CheckCircle,
  X,
  Edit,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
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
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { EmergencyContact } from '../app/page';


interface EmergencyScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function EmergencyScreen({ onNavigate }: EmergencyScreenProps) {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const contactsQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'users', user.uid, 'emergencyContacts');
  }, [db, user]);

  const { data: contacts, isLoading: loading } =
    useCollection<EmergencyContact>(contactsQuery);

  const [emergencyActivated, setEmergencyActivated] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    relation: '',
    phone: '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleEmergencyCall = () => {
    setEmergencyActivated(true);
    // In real app, this would trigger actual emergency protocols
  };

  const handleAddContact = async () => {
    if (user && db && newContact.name && newContact.phone) {
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
          console.error("Error converting file to Base64:", error);
          toast({
            variant: "destructive",
            title: "Processing Failed",
            description: "Could not process the image file.",
          });
          setIsUploading(false);
          return;
        }
      }

      try {
        const contactsCollection = collection(db, `users/${user.uid}/emergencyContacts`);
        await addDoc(contactsCollection, {
          ...newContact,
          avatar: avatarDataUrl,
          isPrimary: false,
          createdAt: serverTimestamp(),
        });
        setNewContact({ name: '', relation: '', phone: '' });
        setAvatarFile(null);
        setIsAddingContact(false);
      } catch (error) {
        console.error("Error adding contact:", error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save the new contact.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };


  const handleDeleteContact = async (id: string) => {
    if (user && db) {
      const contactDoc = doc(db, `users/${user.uid}/emergencyContacts`, id);
      await deleteDoc(contactDoc);
    }
  };

  const handleSetPrimary = async (id: string) => {
    if (user && db && contacts) {
      for (const contact of contacts) {
        const contactDoc = doc(
          db,
          `users/${user.uid}/emergencyContacts`,
          contact.id
        );
        await updateDoc(contactDoc, { isPrimary: contact.id === id });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg">
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
              <AlertCircle className="w-8 h-8" />
              <h2 className="text-2xl">Emergency Help</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Emergency Button */}
          {!emergencyActivated ? (
            <Card className="p-8 bg-white border-4 border-red-500 shadow-xl">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-14 h-14 text-red-600 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-3xl text-gray-900 mb-2">
                    Need Immediate Help?
                  </h3>
                  <p className="text-lg text-gray-600">
                    Press the emergency button to instantly alert your contacts
                    and share your location
                  </p>
                </div>
                <Button
                  onClick={handleEmergencyCall}
                  className="h-24 px-12 bg-red-600 hover:bg-red-700 rounded-2xl shadow-lg text-2xl"
                >
                  <AlertCircle className="w-10 h-10 mr-4" />
                  Emergency Alert
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-green-50 border-4 border-green-500 shadow-xl">
              <div className="text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-14 h-14 text-green-600" />
                </div>
                <div>
                  <h3 className="text-3xl text-green-900 mb-2">
                    Help is on the way!
                  </h3>
                  <p className="text-lg text-gray-600">
                    Your emergency contacts have been notified
                  </p>
                </div>

                <div className="space-y-3 text-left max-w-md mx-auto">
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-base">Contacts Notified</p>
                      <p className="text-sm text-gray-500">
                        {contacts?.length || 0} people alerted
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-base">Location Shared</p>
                      <p className="text-sm text-gray-500">Live tracking active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl">
                    <Phone className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-base">Emergency Services</p>
                      <p className="text-sm text-gray-500">Ready to connect</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setEmergencyActivated(false)}
                  variant="outline"
                  className="h-14 px-8 text-lg rounded-xl border-2"
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancel Alert
                </Button>
              </div>
            </Card>
          )}

          {/* Quick Emergency Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="h-20 bg-red-600 hover:bg-red-700 rounded-xl flex items-center justify-center gap-3 text-white shadow-md">
              <Phone className="w-6 h-6" />
              <span className="text-lg">Call 911</span>
            </Button>
            <Button className="h-20 bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center justify-center gap-3 text-white shadow-md">
              <Phone className="w-6 h-6" />
              <span className="text-lg">Call Doctor</span>
            </Button>
            <Button className="h-20 bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center gap-3 text-white shadow-md">
              <MapPin className="w-6 h-6" />
              <span className="text-lg">Share Location</span>
            </Button>
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-gray-900">Emergency Contacts</h3>
              <Dialog
                open={isAddingContact}
                onOpenChange={setIsAddingContact}
              >
                <DialogTrigger asChild>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Contact
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">
                      Add Emergency Contact
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-base">Name</label>
                      <Input
                        placeholder="Enter name"
                        value={newContact.name}
                        onChange={(e) =>
                          setNewContact({ ...newContact, name: e.target.value })
                        }
                        className="h-12 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-base">Relation</label>
                      <Input
                        placeholder="e.g., Son, Daughter, Friend"
                        value={newContact.relation}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            relation: e.target.value,
                          })
                        }
                        className="h-12 text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-base">Phone Number</label>
                      <Input
                        placeholder="+1 (555) 000-0000"
                        value={newContact.phone}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            phone: e.target.value,
                          })
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
                        onClick={handleAddContact}
                        disabled={!newContact.name || !newContact.phone || isUploading}
                        className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                      >
                         {isUploading ? "Saving..." : "Add Contact"}
                      </Button>
                      <Button
                        onClick={() => setIsAddingContact(false)}
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

            <div className="space-y-3">
              {loading && <p>Loading contacts...</p>}
              {contacts?.map((contact) => (
                <Card
                  key={contact.id}
                  className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-xl text-gray-900">
                          {contact.name}
                        </h4>
                        {contact.isPrimary && (
                          <Badge className="bg-green-100 text-green-700 border-0">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-base text-gray-600">
                        {contact.relation}
                      </p>
                      <p className="text-base text-gray-500">
                        {contact.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleSetPrimary(contact.id)}
                        variant="outline"
                        className="h-12 w-12 rounded-xl"
                        title="Set as primary"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        className="h-12 w-12 bg-green-600 hover:bg-green-700 rounded-xl"
                        title="Call"
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteContact(contact.id)}
                        variant="outline"
                        className="h-12 w-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Safety Instructions */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-xl text-blue-900 mb-4">
              Emergency Guidelines
            </h3>
            <ol className="space-y-3 text-base text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                <span>
                  Press the Emergency Alert button above to notify all contacts
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                <span>
                  Your location will be shared automatically with emergency
                  contacts
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                <span>
                  For life-threatening emergencies, call 911 immediately
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
                  4
                </span>
                <span>Keep your emergency contacts list updated regularly</span>
              </li>
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

    