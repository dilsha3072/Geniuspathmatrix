
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { GoalPlan } from '@/lib/types';
import { PlusCircle, BookOpen, Wrench, Users, Bot, Star } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getGeneratedGoals } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';

const categoryIcons = {
  Academic: <BookOpen className="h-5 w-5 text-blue-500" />,
  Skill: <Wrench className="h-5 w-5 text-orange-500" />,
  Networking: <Users className="h-5 w-5 text-purple-500" />,
};

type Goal = GoalPlan[string][0];

function GoalItem({ goal }: { goal: Goal }) {
  return (
    <div className="flex items-start space-x-4 py-3">
      <Star className="h-4 w-4 mt-1 text-primary/70 flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold">{goal.title}</p>
        <p className="text-sm text-muted-foreground">{goal.description}</p>
      </div>
    </div>
  );
}

function GoalCategory({ title, goals, icon }: { title: "Academic" | "Skill" | "Networking", goals: Goal[], icon: React.ReactNode }) {
    const filteredGoals = goals.filter(g => g.category === title);
    if (filteredGoals.length === 0) return null;

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
                  {filteredGoals.map((goal, index) => (
                      <GoalItem key={index} goal={goal} />
                  ))}
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}

function GeneratePlanDialog({ onPlanGenerated }: { onPlanGenerated: (plan: GoalPlan) => void }) {
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const careerName = formData.get('careerName') as string;
    const studentProfile = formData.get('studentProfile') as string;
    const timeframes = (formData.get('timeframes') as string)
      .split(',')
      .map(t => t.trim().toLowerCase().replace(' ', '-'))
      .filter(t => t);

    if (!careerName || !studentProfile || timeframes.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields to generate your plan.',
      });
      setIsLoading(false);
      return;
    }

    const result = await getGeneratedGoals({ careerName, studentProfile, timeframes });

    if (result.success && result.data) {
      onPlanGenerated(result.data);
      toast({
        title: 'Plan Generated!',
        description: `Your new GoalMint™ plan for ${careerName} is ready.`,
      });
      setOpen(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: result.error || 'There was a problem generating your goal plan. Please try again.',
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Bot className="mr-2 h-4 w-4" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Your GoalMint™ Plan</DialogTitle>
          <DialogDescription>
            Tell our AI about your career choice to build a personalized roadmap.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="careerName" className="text-right">
              Career
            </Label>
            <Input id="careerName" name="careerName" placeholder="e.g., Software Engineer" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="studentProfile" className="text-right">
              Your Profile
            </Label>
            <Textarea id="studentProfile" name="studentProfile" placeholder="Briefly describe your skills, interests, and personality." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeframes" className="text-right">
              Timeframes
            </Label>
            <Input id="timeframes" name="timeframes" placeholder="e.g., 1 year, 3 years, 10 years" className="col-span-3" defaultValue="1-year, 3-year, 5-year" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <LoadingSpinner className="mr-2" />}
              Generate Plan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function GoalsPage() {
  const [goals, setGoals] = React.useState<GoalPlan | null>(null);

  const goalPlans = goals ? Object.entries(goals).map(([period, goals]) => ({
    period: period,
    title: period.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    goals: goals,
  })) : [];
  
  const hasGoals = goals && Object.keys(goals).length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="GoalMint Planner" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold font-headline tracking-tight">Your SMART GoalMint™ Plan</h2>
                    <p className="text-muted-foreground">Tools: AI Goal Builder + Career Roadmap Planner. Translate your chosen career path into an executable roadmap.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Goal
                  </Button>
                  <GeneratePlanDialog onPlanGenerated={setGoals} />
                </div>
            </div>
          
          {hasGoals ? (
            <Tabs defaultValue={goalPlans[0].period} className="w-full">
              <TabsList className={`grid w-full grid-cols-${goalPlans.length}`}>
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
                        Your SMART goals and execution timeline for the next {plan.period.replace('-',' ')}.
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
          ) : (
             <Card className="text-center p-12 border-dashed">
                <Bot className="h-12 w-12 mx-auto text-muted-foreground" />
                <CardTitle className="font-headline mt-4">Create Your Career Roadmap</CardTitle>
                <CardDescription className="mt-2 mb-6 max-w-sm mx-auto">
                    Your GoalMint™ Plan is currently empty. Use the AI Goal Builder to generate a personalized action plan based on your career choice.
                </CardDescription>
                <GeneratePlanDialog onPlanGenerated={setGoals} />
             </Card>
          )}
        </div>
      </main>
    </div>
  );
}
