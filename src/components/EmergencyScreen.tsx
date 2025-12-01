
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
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
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
        toast({ title: "Contact Added", description: `${newContact.name} has been added.`});
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
      toast({ title: "Contact Removed" });
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
      toast({ title: "Primary Contact Updated" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 space-y-8">
      {/* Header */}
      <header>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Emergency</h1>
          <p className="text-muted-foreground">Manage contacts and trigger alerts.</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Emergency Button */}
        {!emergencyActivated ? (
          <Card className="p-8 bg-red-900/20 border-2 border-red-500/50 shadow-xl shadow-red-500/10 transition-all hover:scale-[1.02] hover:shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-14 h-14 text-red-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-3xl text-red-200 mb-2">
                  Need Immediate Help?
                </h3>
                <p className="text-lg text-red-200/80">
                  Press the emergency button to instantly alert your primary contacts and share your location.
                </p>
              </div>
              <Button
                onClick={handleEmergencyCall}
                className="h-24 px-12 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-2xl shadow-lg shadow-red-500/20 text-2xl text-white"
              >
                <AlertCircle className="w-10 h-10 mr-4" />
                Emergency Alert
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 bg-green-900/20 border-2 border-green-500/50 shadow-xl shadow-green-500/10 transition-all hover:scale-[1.02] hover:shadow-2xl">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-14 h-14 text-green-400" />
              </div>
              <div>
                <h3 className="text-3xl text-green-200 mb-2">
                  Help is on the way!
                </h3>
                <p className="text-lg text-green-200/80">
                  Your primary contacts have been notified of your situation.
                </p>
              </div>

              <div className="space-y-3 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3 bg-card/60 p-4 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-base text-foreground">Contacts Notified</p>
                    <p className="text-sm text-muted-foreground">{contacts?.filter(c => c.isPrimary).length || 0} people alerted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-card/60 p-4 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-base text-foreground">Location Shared</p>
                    <p className="text-sm text-muted-foreground">Live tracking active</p>
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

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Emergency Contacts</CardTitle>
                <p className="text-muted-foreground">Your trusted circle for urgent situations.</p>
              </div>
              <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
                <DialogTrigger asChild>
                  <Button>
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
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <Input
                        placeholder="Enter name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Relation</label>
                      <Input
                        placeholder="e.g., Son, Daughter, Friend"
                        value={newContact.relation}
                        onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <Input
                        placeholder="+1 (555) 000-0000"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Photo (Optional)</label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                        className="h-12 text-base file:text-foreground"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleAddContact}
                        disabled={!newContact.name || !newContact.phone || isUploading}
                        className="flex-1 h-12"
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
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {loading && <p className="text-muted-foreground text-center py-4">Loading contacts...</p>}
              {contacts?.map((contact) => (
                <Card
                  key={contact.id}
                  className="p-4 bg-card/60 transition-all hover:shadow-lg hover:scale-[1.02] hover:bg-primary/10"
                >
                  <div className="flex items-center gap-4">
                    <ImageWithFallback
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-foreground">
                          {contact.name}
                        </h4>
                        {contact.isPrimary && (
                          <Badge variant="secondary" className="bg-primary/20 text-primary">
                            Primary
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contact.relation}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contact.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleSetPrimary(contact.id)}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full"
                        title="Set as primary"
                        disabled={contact.isPrimary}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-green-500/10 text-green-400 hover:text-green-300"
                        title="Call"
                      >
                        <Phone className="w-5 h-5" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteContact(contact.id)}
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-red-500/10 text-red-400 hover:text-red-300"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
