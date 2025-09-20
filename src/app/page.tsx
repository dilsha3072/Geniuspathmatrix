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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { chartData } from '@/lib/data';
import { Progress } from '@/components/ui/progress';

export default function Home() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="bg-gradient-to-r from-[#1E63C5] to-[#2F80ED] text-white">
            <AppHeader title="Dashboard" showAuthButtons={true} />
            <main className="p-4 md:p-6 lg:p-12">
              <div className="mx-auto max-w-7xl">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Hello, Alex!
                  </h1>
                  <p className="text-lg text-sky-200">
                    Here's a summary of your career journey progress
                  </p>
                </div>
              </div>
            </main>
          </div>
          <div className="flex-1 space-y-8 bg-background p-4 md:p-6 lg:p-12">
            <div className="mx-auto max-w-7xl space-y-8">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col text-center items-center">
                  <CardHeader className="items-center">
                    <CardTitle className="font-headline text-lg text-muted-foreground">
                      CAREER PROGRESS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center justify-center">
                    <div className="relative h-32 w-32">
                      <svg className="h-full w-full" viewBox="0 0 36 36">
                        <path
                          className="text-gray-700"
                          strokeWidth="3"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        ></path>
                        <path
                          className="text-primary"
                          strokeWidth="3"
                          strokeDasharray="60, 100"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        ></path>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">60%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Completed
                    </p>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="font-headline text-lg text-muted-foreground">
                      SKILLS ANALYSIS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--card))' }}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg text-muted-foreground">QUICK ACTIONS</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Link href="/assessment" className="flex flex-col items-center text-center gap-2 p-4 rounded-lg hover:bg-card">
                    <CheckSquare className="h-8 w-8 text-accent" />
                    <span className="font-semibold text-sm">Take Assessment</span>
                  </Link>
                  <Link href="/assessment" className="flex flex-col items-center text-center gap-2 p-4 rounded-lg hover:bg-card">
                    <Compass className="h-8 w-8 text-accent" />
                    <span className="font-semibold text-sm">Explore Careers</span>
                  </Link>
                   <Link href="/goals" className="flex flex-col items-center text-center gap-2 p-4 rounded-lg hover:bg-card">
                    <Goal className="h-8 w-8 text-accent" />
                    <span className="font-semibold text-sm">Plan Your Goals</span>
                  </Link>
                  <Link href="/mentors" className="flex flex-col items-center text-center gap-2 p-4 rounded-lg hover:bg-card">
                    <Bot className="h-8 w-8 text-accent" />
                    <span className="font-semibold text-sm">Chat with Mentor</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
