'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { goals } from '@/lib/data';
import type { Goal } from '@/lib/types';
import { PlusCircle, BookOpen, Wrench, Users } from 'lucide-react';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';


const categoryIcons = {
  Academic: <BookOpen className="h-5 w-5 text-blue-500" />,
  Skill: <Wrench className="h-5 w-5 text-orange-500" />,
  Networking: <Users className="h-5 w-5 text-purple-500" />,
};

function GoalItem({ goal }: { goal: Goal }) {
  return (
    <div className="flex items-center space-x-4 py-2">
      <Checkbox id={`goal-${goal.id}`} checked={goal.completed} />
      <div className="flex-1">
        <Label htmlFor={`goal-${goal.id}`} className={goal.completed ? "line-through text-muted-foreground" : ""}>
          {goal.title}
        </Label>
        <p className="text-xs text-muted-foreground">
          Due: {format(goal.dueDate, 'PPP')}
        </p>
      </div>
    </div>
  );
}

function GoalCategory({ title, goals, icon }: { title: "Academic" | "Skill" | "Networking", goals: Goal[], icon: React.ReactNode }) {
    const filteredGoals = goals.filter(g => g.category === title);
    if(filteredGoals.length === 0) return null;

    return (
        <AccordionItem value={title.toLowerCase()}>
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{title} Goals</span>
                    <Badge variant="secondary">{filteredGoals.length}</Badge>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <div className="space-y-2 pl-4 border-l-2 ml-2">
                {filteredGoals.map((goal) => (
                    <GoalItem key={goal.id} goal={goal} />
                ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    )
}

export default function GoalsPage() {
  const goalPlans = [
    { period: '1-year', title: '1-Year Plan', goals: goals['1-year'] },
    { period: '3-year', title: '3-Year Plan', goals: goals['3-year'] },
    { period: '5-year', title: '5-Year Plan', goals: goals['5-year'] },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Goal Planning" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold font-headline tracking-tight">Your GoalMint™ Plans</h2>
                    <p className="text-muted-foreground">Map out your future with short-term and long-term objectives.</p>
                </div>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Goal
                </Button>
            </div>
          
          <Tabs defaultValue="1-year" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {goalPlans.map((plan) => (
                <TabsTrigger key={plan.period} value={plan.period}>
                  {plan.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {goalPlans.map((plan) => (
              <TabsContent key={plan.period} value={plan.period}>
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">{plan.title}</CardTitle>
                    <CardDescription>
                      Your objectives for the next {plan.period.replace('-',' ')}.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="multiple" defaultValue={['academic', 'skill', 'networking']} className="w-full">
                      <GoalCategory title="Academic" goals={plan.goals} icon={categoryIcons.Academic} />
                      <GoalCategory title="Skill" goals={plan.goals} icon={categoryIcons.Skill} />
                      <GoalCategory title="Networking" goals={plan.goals} icon={categoryIcons.Networking} />
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
