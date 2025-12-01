import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Send, Heart, Activity, Users, Calendar, Pill, AlertCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Screen, User } from '../app/page';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hello ${user.name}! I'm MITRAM, your caring companion. How can I help you today?`,
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
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
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
        id: messages.length + 2,
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
        text: "I can help you manage your medicines! You have 3 medicines scheduled for today. Would you like to see your medicine schedule or set a new reminder?",
        options: [
          { icon: Pill, label: 'View Schedule', action: 'view_medicine' },
          { icon: Calendar, label: 'Add Reminder', action: 'add_medicine' },
          { icon: AlertCircle, label: 'Mark as Taken', action: 'mark_taken' }
        ]
      };
    }

    // Appointment related
    if (input.includes('appointment') || input.includes('doctor') || input.includes('visit')) {
      return {
        text: "You have a doctor's appointment scheduled with Dr. Smith on November 25th at 4:30 PM. Would you like me to remind you or reschedule?",
        options: [
          { icon: Calendar, label: 'View Appointments', action: 'view_appointments' },
          { icon: Phone, label: 'Call Doctor', action: 'call_doctor' },
          { icon: AlertCircle, label: 'Set Reminder', action: 'reminder' }
        ]
      };
    }

    // Health related
    if (input.includes('health') || input.includes('feeling') || input.includes('wellness')) {
      return {
        text: "I'd love to help with your health! Your current health score is 98%. Would you like to log today's vitals or review your health trends?",
        options: [
          { icon: Activity, label: 'Log Vitals', action: 'log_vitals' },
          { icon: Heart, label: 'Health Report', action: 'health_report' },
          { icon: Calendar, label: 'Wellness Tips', action: 'wellness' }
        ]
      };
    }

    // Family related
    if (input.includes('family') || input.includes('call') || input.includes('contact')) {
      return {
        text: "You have 5 new messages from your family! Sarah and John sent you messages today. Would you like to read them or make a video call?",
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
        text: `Hello ${user.name}! 😊 I'm here to help you with anything you need. What would you like to do today?`,
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
        message = 'Show me my medicine reminders';
        break;
      case 'appointments':
        message = 'Show my appointments';
        break;
      case 'health':
        message = 'Check my health status';
        break;
      case 'family':
        message = 'Connect with my family';
        break;
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg">
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
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl">MITRAM Assistant</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-sm opacity-90">Always here for you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <Card
                  className={`p-4 shadow-md ${
                    message.sender === 'user'
                      ? 'bg-indigo-600 text-white border-0'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <p className="text-lg leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </Card>

                {/* Quick Options */}
                {message.options && message.options.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {message.options.map((option, index) => {
                      const Icon = option.icon;
                      return (
                        <Button
                          key={index}
                          onClick={() => handleOptionClick(option.action)}
                          variant="outline"
                          className="h-auto py-3 px-4 flex items-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-500 rounded-xl transition-all"
                        >
                          <Icon className="w-5 h-5 text-indigo-600" />
                          <span className="text-sm">{option.label}</span>
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
              <Card className="p-4 bg-white border-gray-200 shadow-md">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex gap-3">
            <Button
              className="h-14 w-14 bg-purple-600 hover:bg-purple-700 rounded-full flex-shrink-0 shadow-md"
              title="Voice Input"
            >
              <Mic className="w-6 h-6" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-indigo-500"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="h-14 w-14 bg-indigo-600 hover:bg-indigo-700 rounded-full flex-shrink-0 shadow-md disabled:opacity-50"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
