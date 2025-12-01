'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CardTitle, CardDescription } from './ui/card';
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
      <div className="w-full max-w-md space-y-8 z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center shadow-lg shadow-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
              </svg>
            </div>
            <span className="text-4xl font-bold">MITRAM</span>
          </div>
          <CardTitle className="text-3xl font-bold">
            {isSigningUp ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="mt-2 text-muted-foreground">
            {isSigningUp
              ? "Let's get you started on your journey."
              : 'Sign in to access your dashboard.'}
          </CardDescription>
        </div>

        <div className="p-8 bg-card/50 backdrop-blur-lg border border-primary/10 rounded-2xl shadow-2xl shadow-primary/10 space-y-6">
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
        </div>

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
      </div>
    </div>
  );
}
