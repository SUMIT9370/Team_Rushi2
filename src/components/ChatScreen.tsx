'use client';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Send, Heart, Activity, Users, Calendar, Pill, AlertCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Screen } from '../app/page';
import type { User } from '@/firebase/auth/use-user';

interface ChatScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'mitram';
  timestamp: Date;
  options?: QuickOption[];
}

interface QuickOption {
  icon: any;
  label: string;
  action: string;
}

export function ChatScreen({ onNavigate, user }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: 1,
          text: `Hello ${user.displayName}! I'm MITRAM, your caring companion. How can I help you today?`,
          sender: 'mitram',
          timestamp: new Date(),
          options: [
            { icon: Pill, label: 'Medicine Reminders', action: 'medicine' },
            { icon: Calendar, label: 'Appointments', action: 'appointments' },
            { icon: Activity, label: 'Health Check', action: 'health' },
            { icon: Users, label: 'Contact Family', action: 'family' },
            { icon: AlertCircle, label: 'Emergency Help', action: 'emergency' },
            { icon: Phone, label: 'Call Someone', action: 'call' }
          ]
        };
        setMessages([welcomeMessage]);
        setIsTyping(false);
      }, 1000);
    }
  }, [messages.length, user.displayName]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate MITRAM response
    setTimeout(() => {
      const response = generateResponse(messageText.toLowerCase());
      const mitramResponse: Message = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'mitram',
        timestamp: new Date(),
        options: response.options
      };

      setMessages(prev => [...prev, mitramResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (input: string): { text: string; options?: QuickOption[] } => {
    // Medicine related
    if (input.includes('medicine') || input.includes('pill') || input.includes('medication')) {
      return {
        text: "I can help you manage your medicines! Would you like to see your medicine schedule or set a new reminder?",
        options: [
          { icon: Pill, label: 'View Schedule', action: 'view_medicine' },
          { icon: Calendar, label: 'Add Reminder', action: 'add_medicine' },
        ]
      };
    }

    // Appointment related
    if (input.includes('appointment') || input.includes('doctor') || input.includes('visit')) {
      return {
        text: "I can help with appointments. Would you like me to remind you or reschedule?",
        options: [
          { icon: Calendar, label: 'View Appointments', action: 'view_appointments' },
          { icon: AlertCircle, label: 'Set Reminder', action: 'reminder' }
        ]
      };
    }

    // Health related
    if (input.includes('health') || input.includes('feeling') || input.includes('wellness')) {
      return {
        text: "I'd love to help with your health! Would you like to log today's vitals or review your health trends?",
        options: [
          { icon: Activity, label: 'Log Vitals', action: 'log_vitals' },
          { icon: Heart, label: 'Health Report', action: 'health_report' }
        ]
      };
    }

    // Family related
    if (input.includes('family') || input.includes('call') || input.includes('contact')) {
      return {
        text: "Connecting with family is important. Would you like to read messages or make a video call?",
        options: [
          { icon: Users, label: 'Read Messages', action: 'read_messages' },
          { icon: Phone, label: 'Video Call', action: 'video_call' },
          { icon: Send, label: 'Send Message', action: 'send_message' }
        ]
      };
    }

    // Emergency related
    if (input.includes('emergency') || input.includes('help') || input.includes('urgent')) {
      return {
        text: "I'm here to help! If this is an emergency, I can immediately alert your family and emergency contacts. Are you okay? Do you need urgent assistance?",
        options: [
          { icon: AlertCircle, label: 'Alert Emergency', action: 'emergency_alert' },
          { icon: Phone, label: 'Call Family', action: 'call_family' },
          { icon: Heart, label: 'I\'m Okay', action: 'okay' }
        ]
      };
    }

    // Greeting
    if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
      return {
        text: `Hello ${user.displayName}! 😊 I'm here to help you with anything you need. What would you like to do today?`,
        options: [
          { icon: Pill, label: 'Medicine Reminders', action: 'medicine' },
          { icon: Activity, label: 'Health Check', action: 'health' },
          { icon: Users, label: 'Contact Family', action: 'family' },
          { icon: Calendar, label: 'My Schedule', action: 'schedule' }
        ]
      };
    }

    // Default response
    return {
      text: "I understand you need help with something. I can assist you with medicines, appointments, health tracking, family connections, or emergencies. What would you like to explore?",
      options: [
        { icon: Pill, label: 'Medicines', action: 'medicine' },
        { icon: Calendar, label: 'Appointments', action: 'appointments' },
        { icon: Activity, label: 'Health', action: 'health' },
        { icon: Users, label: 'Family', action: 'family' }
      ]
    };
  };

  const handleOptionClick = (action: string) => {
    let message = '';
    switch (action) {
      case 'medicine':
        onNavigate('reminders');
        return;
      case 'appointments':
        onNavigate('reminders');
        return;
      case 'health':
        onNavigate('health');
        return;
      case 'family':
        onNavigate('family');
        return;
      case 'emergency':
        onNavigate('emergency');
        return;
      case 'call':
        message = 'I want to call someone';
        break;
      default:
        message = action;
    }
    handleSend(message);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <Card
                  className={`p-3 md:p-4 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card/60 text-card-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-base leading-relaxed">{message.text}</p>
                  
                </Card>
                <p className={`text-xs mt-1.5 px-1 ${message.sender === 'user' ? 'text-right' : 'text-left'} text-muted-foreground`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Quick Options */}
                {message.options && message.sender === 'mitram' && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {message.options.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={index}
                          onClick={() => handleOptionClick(option.action)}
                          variant="outline"
                          className="h-auto py-2.5 px-3 flex items-center justify-start gap-3 bg-card/60 hover:bg-accent border shadow-sm rounded-lg transition-all"
                        >
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <Card className="p-4 bg-card/60 border-border shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-background/80 backdrop-blur-sm border-t sticky bottom-0">
        <div className="max-w-4xl mx-auto p-2 sm:p-4">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="h-12 w-12 rounded-full flex-shrink-0 shadow-sm"
              title="Voice Input"
            >
              <Mic className="w-6 h-6" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="h-12 text-base rounded-full border-2 border-border focus:border-primary shadow-sm bg-secondary"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              size="icon"
              className="h-12 w-12 bg-primary hover:bg-primary/90 rounded-full flex-shrink-0 shadow-sm disabled:opacity-50"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
