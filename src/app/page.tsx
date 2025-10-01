
'use client';

import Link from 'next/link';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, ClipboardCheck, Compass, Goal, GraduationCap } from 'lucide-react';
import * as React from 'react';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { useAuth } from '@/contexts/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const featureCards = [
    {
        icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
        title: 'InsightX Assessment',
        description: 'Understand who you are. Take our scientific diagnostic tests to uncover your personality, interests, and skills.',
        link: '/assessment',
        linkText: 'Start Assessment',
    },
    {
        icon: <Compass className="w-8 h-8 text-primary" />,
        title: 'PathXplore Career',
        description: 'Explore careers that truly fit. Our AI engine matches your profile to the top 5 career options.',
        link: '/pathxplore',
        linkText: 'Explore Careers',
    },
    {
        icon: <Goal className="w-8 h-8 text-primary" />,
        title: 'GoalMint Planner',
        description: 'Design your SMART career plan. Convert your chosen career path into actionable 1, 3, and 5-year plans.',
        link: '/goals',
        linkText: 'Plan Your Goals',
    },
    {
        icon: <Bot className="w-8 h-8 text-primary" />,
        title: 'MentorSuite AI',
        description: 'Grow with expert guidance. Chat with our AI Mentor to get reflective questions and career advice.',
        link: '/mentors',
        linkText: 'Chat with Mentor',
    },
]

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


export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
        <HomePageHeader />
        <main className="flex-1 p-8 md:p-10 lg:p-12">
            <div className="mx-auto max-w-7xl space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground">Welcome to Your Career Journey</h1>
                    <p className="text-xl font-medium text-primary">Your Blueprint for Career Excellence. Design Your Future Today!</p>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                        Path-GeniX™ is here to guide you through a structured, personalized, and metacognitive career discovery journey. Let's build your future, Today.
                    </p>
                    <Button size="lg" asChild className="font-semibold">
                       <Link href="/assessment">Begin Your Journey <ArrowRight /></Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {featureCards.map((card) => (
                        <Card key={card.title} className="flex flex-col">
                            <CardHeader className="flex-row items-start gap-4">
                                {card.icon}
                                <CardTitle className="font-headline text-xl">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <CardDescription>{card.description}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={card.link}>
                                        {card.linkText} <ArrowRight className="ml-2"/>
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    </div>
  );
}
