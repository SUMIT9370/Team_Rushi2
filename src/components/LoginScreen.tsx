'use client';
import { useState } from 'react';
import { Heart, ChevronRight, Shield, Users, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
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
      // User will be automatically signed in by onAuthStateChanged
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
    // On success, onAuthStateChanged will handle the rest
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl">MITRAM</span>
          </div>

          <h1 className="text-5xl md:text-6xl text-gray-900">
            Your Digital
            <span className="block bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Companion
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-md">
            A smart, caring friend that helps you stay connected, healthy, and
            safe every day.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <Card className="p-8 md:p-12 shadow-2xl border-0 bg-white/80 backdrop-blur">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl text-gray-900">
                {isSigningUp ? 'Create an Account' : 'Welcome Back!'}
              </h2>
              <p className="text-lg text-gray-600">
                {isSigningUp
                  ? 'Let\'s get you started.'
                  : 'Sign in to continue.'}
              </p>
            </div>

            <div className="space-y-4">
              {isSigningUp && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-lg text-gray-700 block">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-lg text-gray-700 block">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-lg text-gray-700 block"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
                />
              </div>
            </div>

            {isSigningUp ? (
              <Button
                onClick={handleSignUp}
                className="w-full h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl shadow-lg text-lg"
              >
                Sign Up
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSignIn}
                className="w-full h-16 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-xl shadow-lg text-lg"
              >
                Sign In
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            )}

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => setIsSigningUp(!isSigningUp)}
              >
                {isSigningUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
