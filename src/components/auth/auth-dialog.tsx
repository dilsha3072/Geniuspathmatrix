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

interface AuthDialogProps {
  mode: 'login' | 'signup' | null;
  onModeChange: (mode: 'login' | 'signup' | null) => void;
}

export function AuthDialog({ mode, onModeChange }: AuthDialogProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onModeChange(null);
      setEmail('');
      setPassword('');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push('/auth/callback');
      handleOpenChange(false);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: `${mode === 'login' ? 'Login' : 'Sign Up'} Failed`,
        description: error.message,
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
              ? 'Enter your email below to login to your account.'
              : 'Enter your email and password to start your journey.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
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
