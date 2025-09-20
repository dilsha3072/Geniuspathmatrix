'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartData } from '@/lib/data';

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

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
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                      <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border)/0.5)" />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
                        <Tooltip
                          cursor={{ fill: 'hsl(var(--card))' }}
                          content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-lg text-muted-foreground">QUICK ACTIONS</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                   <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg">
                      <div className="text-3xl font-bold font-headline text-accent">7</div>
                      <span className="font-semibold text-sm">Completed Modules</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg">
                      <div className="text-3xl font-bold font-headline text-accent">5</div>
                      <span className="font-semibold text-sm">Suggested Careers</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg">
                      <div className="text-3xl font-bold font-headline text-accent">12</div>
                      <span className="font-semibold text-sm">Goals Created</span>
                   </div>
                   <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg">
                      <div className="text-3xl font-bold font-headline text-accent">2</div>
                      <span className="font-semibold text-sm">Mentors Connected</span>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
