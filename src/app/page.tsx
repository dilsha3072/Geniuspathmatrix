'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Bot, CheckSquare, Compass, Goal } from 'lucide-react';
import Link from 'next/link';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';

export default function Home() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-0 flex-1 flex-col">
          <AppHeader title="Home" showAuthButtons={true} />
          <main className="flex-1 space-y-8 bg-background p-4 md:p-6 lg:p-12">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold font-headline tracking-tight">
                  Welcome to Your Career Journey
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                  Path-GeniX™ is here to guide you through a structured, personalized, and metacognitive career discovery journey. Let's start building your future, today.
                </p>
                <Button size="lg" asChild>
                  <Link href="/assessment">
                    Begin Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="flex flex-col text-center items-center">
                  <CardHeader className="items-center">
                    <CheckSquare className="h-8 w-8 mb-4 shrink-0 text-primary" />
                    <CardTitle className="font-headline text-lg">
                      InsightX Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Understand who you are. Take our scientific diagnostic tests to uncover your personality, interests, and skills.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button variant="ghost" asChild className="text-sm font-semibold">
                      <Link href="/assessment">
                        Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="flex flex-col text-center items-center">
                  <CardHeader className="items-center">
                    <Compass className="h-8 w-8 mb-4 shrink-0 text-primary" />
                    <CardTitle className="font-headline text-lg">
                      PathXplore Career
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <p className="text-sm text-muted-foreground">
                      Explore careers that truly fit. Our AI engine matches your profile to the top 5 career options.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button variant="ghost" asChild className="text-sm font-semibold">
                      <Link href="/assessment">
                        Explore Careers <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="flex flex-col text-center items-center">
                  <CardHeader className="items-center">
                    <Goal className="h-8 w-8 mb-4 shrink-0 text-primary" />
                    <CardTitle className="font-headline text-lg">
                      GoalMint Planner
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <p className="text-sm text-muted-foreground">
                      Design your SMART career plan. Convert your chosen career path into actionable 1, 3, and 5-year plans.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button variant="ghost" asChild className="text-sm font-semibold">
                      <Link href="/goals">
                        Plan Your Goals <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="flex flex-col text-center items-center">
                  <CardHeader className="items-center">
                    <Bot className="h-8 w-8 mb-4 shrink-0 text-primary" />
                     <CardTitle className="font-headline text-lg">
                      MentorSuite AI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      Grow with expert guidance. Chat with our AI Mentor to get reflective questions and career advice.
                    </p>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button variant="ghost" asChild className="text-sm font-semibold">
                      <Link href="/mentors">
                        Chat with Mentor <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
