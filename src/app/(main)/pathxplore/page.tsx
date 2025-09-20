
'use client';

import * as React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { careerPaths } from '@/lib/data';
import type { CareerPath } from '@/lib/types';
import { ArrowRight, Check, Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function CareerDetailsDialog({ career }: { career: CareerPath }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">View Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl">
            {career.title}
          </DialogTitle>
          <DialogDescription>
            A detailed look into the career path of a {career.title}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Key Information</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Average Salary:</strong> {career.avgSalary}
              </p>
              <p>
                <strong>Job Outlook:</strong> {career.jobOutlook}
              </p>
              <p>
                <strong>Minimum Education:</strong> {career.minEducation}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">
                Typical Responsibilities
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {career.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 text-center">
              Required Skill Match
            </h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={career.skillMatch}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="skill"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--accent))' }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="match" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <CardFooter className="mt-6 p-0">
          <Button size="lg" className="w-full" asChild>
            <Link href="/goals">
              Create Goal Plan <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </DialogContent>
    </Dialog>
  );
}

function CareerCard({
  career,
  isTopPick,
}: {
  career: CareerPath;
  isTopPick?: boolean;
}) {
  return (
    <Card
      className={cn(
        'flex flex-col',
        isTopPick && 'border-primary border-2 shadow-lg'
      )}
    >
      {isTopPick && (
        <Badge
          variant="default"
          className="w-fit gap-1 self-start -mt-3 ml-4"
        >
          <Star className="h-3 w-3" /> Top Pick for You
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="font-headline">{career.title}</CardTitle>
        <CardDescription>{career.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Why it's a match:</h4>
          <div className="space-y-2">
            {career.matchReasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-1 text-green-500 shrink-0" />
                <p className="text-sm text-muted-foreground">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <CareerDetailsDialog career={career} />
        <Button>Select Path</Button>
      </CardFooter>
    </Card>
  );
}

export default function PathXplorePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="PathXplore Career" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-bold font-headline tracking-tight">
              Explore Your Top Career Paths
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Based on your InsightX Assessment, we've identified these careers
              as a strong fit for your unique profile. Dive in to learn more
              about each path.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careerPaths.map((career, index) => (
              <CareerCard
                key={career.id}
                career={career}
                isTopPick={index === 0}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
