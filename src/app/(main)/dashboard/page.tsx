'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Bot, CheckSquare, Compass, Goal } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Home" showAuthButtons />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8 bg-background">
        <div className="max-w-7xl mx-auto">
            <div className="space-y-4 text-center mb-12">
            <h2 className="text-4xl font-bold font-headline tracking-tight">Welcome to Your Career Journey</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Path-GeniX™ is here to guide you through a structured, personalized, and metacognitive career discovery journey. Let&apos;s start building your future, today.
            </p>
            <Button asChild size="lg">
                <Link href="/assessment">
                Begin Your Journey <ArrowRight className="ml-2" />
                </Link>
            </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader>
                <div className="flex items-center gap-4">
                    <CheckSquare className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">InsightX Assessment</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <CardDescription>
                    Understand who you are. Take our scientific diagnostic tests to uncover your personality, interests, and skills.
                </CardDescription>
                </CardContent>
                <CardContent>
                    <Button variant="ghost" asChild className="p-0 h-auto">
                        <Link href="/assessment">Start Assessment <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <div className="flex items-center gap-4">
                    <Compass className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">PathXplore Career</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <CardDescription>
                    Explore careers that truly fit. Our AI engine matches your profile to the top 5 career options.
                </CardDescription>
                </CardContent>
                <CardContent>
                    <Button variant="ghost" asChild className="p-0 h-auto">
                        <Link href="#">Explore Careers <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <div className="flex items-center gap-4">
                    <Goal className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">GoalMint Planner</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <CardDescription>
                    Design your SMART career plan. Convert your chosen career path into actionable 1, 3, and 5-year plans.
                </CardDescription>
                </CardContent>
                <CardContent>
                     <Button variant="ghost" asChild className="p-0 h-auto">
                        <Link href="/goals">Plan Your Goals <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <div className="flex items-center gap-4">
                    <Bot className="h-8 w-8 text-primary" />
                    <CardTitle className="font-headline text-xl">MentorSuite AI</CardTitle>
                </div>
                </CardHeader>
                <CardContent>
                <CardDescription>
                    Grow with expert guidance. Chat with our AI Mentor to get reflective questions and career advice.
                </CardDescription>
                </CardContent>
                <CardContent>
                     <Button variant="ghost" asChild className="p-0 h-auto">
                        <Link href="#">Chat with Mentor <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
