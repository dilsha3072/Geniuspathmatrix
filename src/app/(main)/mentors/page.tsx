'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function MentorsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Mentor Suite" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-bold font-headline tracking-tight">MentorSuite AI</h2>
            <p className="text-muted-foreground">Your AI-powered career co-pilot.</p>
          </div>
          <Card className="text-center p-12">
            <CardHeader>
              <Bot className="h-16 w-16 mx-auto text-primary" />
              <CardTitle className="font-headline mt-4 text-2xl">Coming Soon!</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="max-w-md mx-auto">
                We are currently developing the MentorSuite AI. This feature will provide you with personalized guidance, answer your career questions, and help you stay on track with your goals. Check back soon!
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
