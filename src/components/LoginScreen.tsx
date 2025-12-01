'use client';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6 text-center md:text-left">
           <div className="inline-flex items-center gap-3">
             <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>
            </div>
            <span className="text-4xl font-bold">MITRAM</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Your Digital
            <span className="block bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Companion
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-md">
            A smart, caring friend that helps you stay connected, healthy, and
            safe every day.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {isSigningUp ? 'Create an Account' : 'Welcome Back!'}
            </CardTitle>
            <CardDescription>
              {isSigningUp ? "Let's get you started." : 'Sign in to continue.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSigningUp && (
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base rounded-lg"
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-muted-foreground"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base rounded-lg"
              />
            </div>

            {isSigningUp ? (
              <Button
                onClick={handleSignUp}
                size="lg"
                className="w-full h-12 bg-primary text-primary-foreground rounded-lg shadow-lg text-base"
              >
                Sign Up
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSignIn}
                size="lg"
                className="w-full h-12 bg-primary text-primary-foreground rounded-lg shadow-lg text-base"
              >
                Sign In
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            )}

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSigningUp(!isSigningUp)}
                className="text-muted-foreground"
              >
                {isSigningUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
