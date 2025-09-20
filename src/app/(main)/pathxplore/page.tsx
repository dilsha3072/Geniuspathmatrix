
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
import type { CareerSuggestion } from '@/lib/types';
import { ArrowRight, Download, FileText, Goal } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';

function CareerCard({
  career,
  isTopPick,
}: {
  career: CareerSuggestion;
  isTopPick?: boolean;
}) {
  return (
    <Card
      className='flex flex-col'
    >
      {isTopPick && (
        <Badge
          variant="default"
          className="w-fit gap-1 self-start -mt-3 ml-4"
        >
          Top Pick for You
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="font-headline">{career.careerName}</CardTitle>
        <CardDescription>{career.careerDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Why it's a match:</h4>
          <p className="text-sm text-muted-foreground">{career.matchExplanation}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-sm">SWOT Analysis:</h4>
          <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: career.swotAnalysis.replace(/\\n/g, '<br />') }}></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
         <Button variant="outline">View Details</Button>
         <Button>Select Path</Button>
      </CardFooter>
    </Card>
  );
}

export default function PathXplorePage() {
  const [results, setResults] = React.useState<CareerSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const storedResults = localStorage.getItem('assessmentResults');
      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Could not load results',
        description: 'There was a problem loading your assessment results.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleGenerateReport = () => {
    // In a real app, this would trigger a more complex report generation flow.
    // For now, we just acknowledge it and point to the reports page.
    toast({
      title: 'Report Generated!',
      description: 'Your PathXplore report is being prepared. You will be able to download it from the Reports section shortly.',
    });
  }

  if (isLoading) {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <AppHeader title="PathXplore Career" />
            <main className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner className="h-10 w-10" />
                    <p className="text-muted-foreground">Loading your results...</p>
                </div>
            </main>
        </div>
    )
  }

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

          {results && results.length > 0 ? (
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((career, index) => (
                    <CareerCard
                        key={career.careerName}
                        career={career}
                        isTopPick={index === 0}
                    />
                    ))}
                </div>

                <Card className="bg-muted/50">
                    <CardHeader className="flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="font-headline">PathXplore Report & Next Steps</CardTitle>
                            <CardDescription>Generate a detailed report of your results and move on to the next step: planning.</CardDescription>
                        </div>
                         <div className="flex gap-4">
                            <Button variant="secondary" onClick={handleGenerateReport}>
                                <FileText className="mr-2"/>
                                Generate Report
                            </Button>
                            <Button asChild>
                                <Link href="/goals">
                                    Go to GoalMint Planner <ArrowRight className="ml-2"/>
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                </Card>

            </div>
          ) : (
             <Card className="text-center p-12">
                <CardTitle className="font-headline mb-2">No Assessment Data Found</CardTitle>
                <CardDescription className="mb-6">Please complete the InsightX Assessment to discover your personalized career paths.</CardDescription>
                <Button asChild>
                    <Link href="/assessment">Take Assessment Now</Link>
                </Button>
             </Card>
          )}
        </div>
      </main>
    </div>
  );
}
