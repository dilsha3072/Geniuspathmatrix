
'use client';

import { AuthDialog } from '@/components/auth/auth-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { ClipboardCheck, GraduationCap, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';

function HomePageHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [authMode, setAuthMode] = React.useState<'login' | 'signup' | null>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  }

  const getInitials = (email: string) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
        <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <div>
                <span className="font-headline text-xl font-semibold text-foreground">Path-GeniX™</span>
                <p className="text-xs text-muted-foreground">Genius Path Matrix</p>
            </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || ''} alt="User avatar" />
                      <AvatarFallback>{getInitials(user.email || '')}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => router.push('/assessment')}>
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    <span>My Journey</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <>
                    <Button variant="ghost" onClick={() => setAuthMode('login')}>Log In</Button>
                    <Button onClick={() => setAuthMode('signup')}>Sign Up</Button>
                </>
            )}
        </div>
      </header>
      <AuthDialog mode={authMode} onModeChange={setAuthMode} />
    </>
  );
}


export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
        <HomePageHeader />
        {children}
    </div>
  );
}
