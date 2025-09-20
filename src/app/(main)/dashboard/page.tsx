'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ArrowRight, Target, Users, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { chartData } from '@/lib/data';

const chartConfig = {
  value: {
    label: 'Proficiency',
    color: 'hsl(var(--primary))',
  },
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Dashboard" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-headline tracking-tight">Welcome back, Alex!</h2>
          <p className="text-muted-foreground">Here&apos;s a snapshot of your career discovery journey.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader className="pb-4">
              <CardTitle>Ready to Explore?</CardTitle>
              <CardDescription>Take our comprehensive assessment to uncover career paths tailored to you.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/assessment">
                  Start InsightX Assessment <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Goals Set</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 / 9</div>
              <p className="text-xs text-muted-foreground">1-year goals completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mentor Sessions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Upcoming sessions this month</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skills Overview</CardTitle>
            <CardDescription>Your self-reported skill proficiency levels.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="value" fill="var(--color-value)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
