import { useState } from 'react';
import { ArrowLeft, Video, Heart, Image, Send, MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Screen } from '../app/page';
import { ImageWithFallback } from './ImageWithFallback';
import type { User } from '@/firebase/auth/use-user';

interface FamilyConnectScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

interface FamilyMessage {
  id: number;
  from: string;
  message: string;
  time: string;
  avatar: string;
  unread: boolean;
}

interface SharedPhoto {
  id: number;
  from: string;
  caption: string;
  time: string;
  imageUrl: string;
}

export function FamilyConnectScreen({ onNavigate, user }: FamilyConnectScreenProps) {
  const [messages, setMessages] = useState<FamilyMessage[]>([
    {
      id: 1,
      from: 'Sarah Johnson',
      message: 'Hi Mom! Hope you had a good morning. Love you! ❤️',
      time: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      unread: true
    },
    {
      id: 2,
      from: 'John Johnson',
      message: 'Don\'t forget to take your medicine! I\'ll call you this evening.',
      time: '4 hours ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      unread: false
    },
    {
      id: 3,
      from: 'Emma Johnson',
      message: 'Grandma, I got an A on my test! Thank you for helping me study! 🎉',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      unread: true
    }
  ]);

  const [sharedPhotos] = useState<SharedPhoto[]>([
    {
      id: 1,
      from: 'Sarah',
      caption: 'Family picnic last weekend! 🌳',
      time: '3 days ago',
      imageUrl: 'https://images.unsplash.com/photo-1627007410492-f410bb5ae2d6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB0b2dldGhlciUyMGhhcHB5fGVufDF8fHx8MTc2MzkxNDM0Mnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 2,
      from: 'Emma',
      caption: 'My art project at school 🎨',
      time: '1 week ago',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400'
    },
    {
      id: 3,
      from: 'John',
      caption: 'Garden flowers blooming beautifully 🌸',
      time: '2 weeks ago',
      imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400'
    }
  ]);

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const markAsRead = (id: number) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, unread: false } : msg
      )
    );
  };

  const handleReply = (messageId: number) => {
    if (replyText.trim()) {
      // In real app, send the reply
      markAsRead(messageId);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const unreadCount = messages.filter(m => m.unread).length;

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
              <Heart className="w-8 h-8" />
              <h2 className="text-2xl">Family Connect</h2>
            </div>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white border-0 text-base px-4 py-2">
                {unreadCount} New
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Quick Video Call */}
          <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl mb-2">Video Call Family</h3>
                <p className="text-lg opacity-90">One-tap to connect with loved ones</p>
              </div>
              <Button className="h-20 w-20 bg-white text-purple-600 hover:bg-gray-100 rounded-full shadow-lg">
                <Video className="w-10 h-10" />
              </Button>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="h-16 bg-green-600 hover:bg-green-700 rounded-xl shadow-md">
              <Phone className="w-5 h-5 mr-2" />
              Call Sarah
            </Button>
            <Button className="h-16 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md">
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </Button>
            <Button className="h-16 bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md">
              <Mail className="w-5 h-5 mr-2" />
              Email All
            </Button>
          </div>

          {/* Messages Section */}
          <div className="space-y-4">
            <h3 className="text-2xl text-gray-900">Messages from Family</h3>

            {messages.map((msg) => (
              <Card
                key={msg.id}
                className={`p-6 shadow-md transition-all hover:shadow-lg ${
                  msg.unread ? 'bg-blue-50 border-2 border-blue-300' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={msg.avatar}
                    alt={msg.from}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="text-xl text-gray-900">{msg.from}</h4>
                        <span className="text-sm text-gray-500">{msg.time}</span>
                      </div>
                      {msg.unread && (
                        <Badge className="bg-blue-500 text-white border-0">New</Badge>
                      )}
                    </div>
                    <p className="text-lg text-gray-700 mb-4">{msg.message}</p>
                    
                    {replyingTo === msg.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          className="h-12 text-base"
                          onKeyPress={(e) => e.key === 'Enter' && handleReply(msg.id)}
                        />
                        <Button
                          onClick={() => handleReply(msg.id)}
                          className="h-12 bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-5 h-5" />
                        </Button>
                        <Button
                          onClick={() => setReplyingTo(null)}
                          variant="outline"
                          className="h-12"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setReplyingTo(msg.id);
                            markAsRead(msg.id);
                          }}
                          className="h-12 bg-blue-500 hover:bg-blue-600 rounded-xl"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Reply
                        </Button>
                        <Button
                          variant="outline"
                          className="h-12 rounded-xl"
                        >
                          <Phone className="w-5 h-5 mr-2" />
                          Call Back
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Photo Sharing Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl text-gray-900">Shared Memories</h3>
              <Button className="bg-purple-600 hover:bg-purple-700 rounded-xl">
                <Image className="w-5 h-5 mr-2" />
                Share Photo
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {sharedPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
                  <ImageWithFallback
                    src={photo.imageUrl}
                    alt={photo.caption}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-lg text-gray-900">{photo.caption}</p>
                        <p className="text-sm text-gray-500">From {photo.from} • {photo.time}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button className="flex-1 h-12 bg-pink-500 hover:bg-pink-600 rounded-xl">
                        <Heart className="w-5 h-5 mr-2" />
                        Like
                      </Button>
                      <Button variant="outline" className="flex-1 h-12 rounded-xl border-2">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Family Circle Info */}
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h3 className="text-2xl text-purple-900 mb-4">👨‍👩‍👧‍👦 Your Family Circle</h3>
            <div className="grid md:grid-cols-2 gap-3 text-base text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>3 family members connected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Safe & private messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>One-tap video calls</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Share special moments</span>
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="text-xl text-blue-900 mb-4">💡 Stay Connected Tips</h3>
            <ul className="space-y-2 text-base text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Check your messages daily to stay in touch</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Share photos of your daily activities</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Schedule weekly video calls with family</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600">•</span>
                <span>Reply to messages to let them know you're well</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
