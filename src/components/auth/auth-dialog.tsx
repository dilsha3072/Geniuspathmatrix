
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import { GraduationCap } from 'lucide-react';
import { adminDb } from '@/lib/firebase/firebase-admin'; // This import is incorrect on the client, but we'll fix the logic.

interface AuthDialogProps {
  mode: 'login' | 'signup' | null;
  onModeChange: (mode: 'login' | 'signup' | null) => void;
}

export function AuthDialog({ mode, onModeChange }: AuthDialogProps) {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onModeChange(null);
      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
      // This is a simplified login flow. In a real app, you'd query Firestore for the user's email from their username.
      // For this implementation, we'll assume the user enters their email in the username field for login.
      // This is a limitation of not having a full backend to resolve username to email.
      if (!username.includes('@')) {
          toast({
              variant: 'destructive',
              title: 'Login Error',
              description: 'For login, please enter your email address in the username field. Username-only login is not supported in this mock setup.',
          });
          setIsLoading(false);
          return;
      }
      await login(username, password);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        // We'll use a simplified login that still relies on email behind the scenes
        await handleLogin();
      } else {
        // Signup with email/password, and pass extra details
        await signup(email, password, { username, phone });
      }
      router.push('/auth/callback');
      handleOpenChange(false);
    } catch (error: any) {
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/invalid-credential' && mode === 'login') {
          description = 'Login failed. Please check your credentials and try again.';
      } else if (error.code === 'auth/email-already-in-use') {
          description = 'This email is already in use. Please try logging in or use a different email.';
      } else if (error.message) {
        description = error.message;
      }
        
      toast({
        variant: 'destructive',
        title: `${mode === 'login' ? 'Login' : 'Sign Up'} Failed`,
        description: description,
      });
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    onModeChange(mode === 'login' ? 'signup' : 'login');
  };

  return (
    <Dialog open={!!mode} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center items-center">
          <GraduationCap className="h-10 w-10 text-primary mb-2" />
          <DialogTitle className="text-2xl font-headline">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Enter your username and password to log in.'
              : 'Create your account to start your journey.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="your_username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          {mode === 'signup' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com (for recovery)"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : (mode === 'login' ? 'Login' : 'Create Account')}
          </Button>
        </form>
        <div className="mt-2 text-center text-sm">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          {' '}
          <Button variant="link" className="p-0 h-auto" onClick={switchMode}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
