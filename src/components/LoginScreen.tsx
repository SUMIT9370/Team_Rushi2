'use client';
import { useState } from 'react';
import { ChevronRight, HeartPulse } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { signUpWithEmail } from '@/firebase/auth/signup';
import { signInWithEmail } from '@/firebase/auth/signin';
import { useToast } from '@/hooks/use-toast';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { toast } = useToast();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all fields to sign up.',
      });
      return;
    }
    const { error } = await signUpWithEmail(email, password, name);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } else {
      toast({
        title: 'Success!',
        description: 'Your account has been created.',
      });
    }
  };

  const handleSignIn = async () => {
    const { error } = await signInWithEmail(email, password);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-background to-purple-900/40 z-0"></div>
      <Card className="w-full max-w-md z-10 bg-card/80 backdrop-blur-lg border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shadow-lg shadow-primary/10">
              <HeartPulse className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            {isSigningUp ? 'Create an Account' : 'Welcome to MITRAM'}
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {isSigningUp
              ? "Your digital companion for a healthier life."
              : 'Sign in to continue your journey.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isSigningUp && (
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base rounded-lg bg-background/70 border-border focus:border-primary"
              />
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 text-base rounded-lg bg-background/70 border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base rounded-lg bg-background/70 border-border focus:border-primary"
            />
          </div>

          <Button
            onClick={isSigningUp ? handleSignUp : handleSignIn}
            size="lg"
            className="w-full h-12 bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/20 text-base transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            {isSigningUp ? 'Sign Up' : 'Sign In'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
           <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="text-muted-foreground hover:text-primary"
            >
              {isSigningUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
