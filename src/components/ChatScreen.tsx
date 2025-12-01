'use client';
import { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Screen } from '../app/page';
import type { User } from '@/firebase/auth/use-user';
import { mitramChat } from '@/ai/flows/mitram-chat-flow';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

interface ChatScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User;
}

export function ChatScreen({ onNavigate, user }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: `Hello ${user.displayName}! I'm MITRAM, your caring companion. How can I help you today?`,
        },
      ]);
    }
  }, [messages.length, user.displayName]);

  const handleSend = async () => {
    const messageText = inputValue.trim();
    if (!messageText) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: messageText },
    ];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await mitramChat({
        history: newMessages.slice(0, -1), // Send history without the latest user message
        message: messageText,
      });

      setMessages([
        ...newMessages,
        { role: 'model', content: response },
      ]);
    } catch (error) {
      console.error('AI chat error:', error);
      setMessages([
        ...newMessages,
        { role: 'model', content: "I'm having a little trouble thinking right now. Please try again in a moment." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <Card
                  className={`p-3 md:p-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card/60 text-card-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-base leading-relaxed">{message.content}</p>
                  
                </Card>
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
              title="Voice Input (Coming Soon)"
              disabled
            >
              <Mic className="w-6 h-6" />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="h-12 text-base rounded-full border-2 border-border focus:border-primary shadow-sm bg-secondary"
              disabled={isTyping}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
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
