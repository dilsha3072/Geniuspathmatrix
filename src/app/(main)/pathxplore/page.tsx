
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
import { ArrowRight, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useAuth } from '@/contexts/auth-context';
import { getUserData } from '@/lib/actions';

function CareerCard({
  career,
  isTopPick,
}: {
  career: CareerSuggestion;
  isTopPick?: boolean;
}) {
  const formatSwot = (text: string) => {
    if (!text) return '';
    const sections = {
        'Strengths': '',
        'Weaknesses': '',
        'Opportunities': '',
        'Threats': ''
    };

    const cleanedText = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
    const lines = cleanedText.split('\n').filter(line => line.trim() !== '');

    let currentSection: keyof typeof sections | null = null;
    
    for (const line of lines) {
        const lineLower = line.toLowerCase();
        if (lineLower.startsWith('strengths:')) currentSection = 'Strengths';
        else if (lineLower.startsWith('weaknesses:')) currentSection = 'Weaknesses';
        else if (lineLower.startsWith('opportunities:')) currentSection = 'Opportunities';
        else if (lineLower.startsWith('threats:')) currentSection = 'Threats';
        else if (currentSection) {
            const item = line.replace(/^[-*]\s*/, '').trim();
            if (item) {
                sections[currentSection] += `<li>${item}</li>`;
            }
        }
    }
    
    let html = '';
    for(const [key, value] of Object.entries(sections)) {
        if (value) {
            html += `<strong class="text-sm font-semibold text-card-foreground/90">${key}:</strong><ul class="list-disc pl-5 mt-1 mb-3 text-muted-foreground">${value}</ul>`;
        }
    }
    return html;
  };

  return (
    <Card
      className='flex flex-col relative'
    >
      {isTopPick && (
        <Badge
          variant="default"
          className="w-fit gap-1 self-start -mt-3 ml-4 absolute top-0 left-0 z-10"
        >
          <Star className="h-3 w-3" />
          Top Pick for You
        </Badge>
      )}
      <CardHeader className="pt-8">
        <CardTitle className="font-headline">{career.careerName}</CardTitle>
        <CardDescription>{career.careerDescription}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Why it's a match:</h4>
          <p className="text-sm text-muted-foreground">{career.matchExplanation}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-sm mt-4">SWOT Analysis:</h4>
          <div className="text-sm space-y-1" dangerouslySetInnerHTML={{ __html: formatSwot(career.swotAnalysis) }}></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
         <Button asChild>
            <Link href="/goals">
                Select Path &amp; Plan Goals
                <ArrowRight className="ml-2"/>
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function PathXplorePage() {
  const [results, setResults] = React.useState<CareerSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  React.useEffect(() => {
    async function loadData() {
      if (authLoading) return;
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await getUserData(user.uid);
        if (res.success && res.data?.careerSuggestions) {
          setResults(res.data.careerSuggestions);
        }
      } catch (e) {
        toast({
          variant: 'destructive',
          title: 'Could not load results',
          description: 'There was a problem loading your assessment results from the database.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [user, authLoading, toast]);

  const handleGenerateReport = () => {
    toast({
      title: 'Report Generated!',
      description: 'Your PathXplore report can be downloaded from the My Reports page.',
    });
    // In a real app, this might trigger a server-side PDF generation
  }

  if (isLoading || authLoading) {
    return (
        <div className="flex min-h-0 flex-1 flex-col">
            <AppHeader title="PathXplore Career" />
            <main className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <LoadingSpinner className="h-10 w-10" />
                    <p className="text-muted-foreground">Loading your personalized career paths...</p>
                </div>
            </main>
        </div>
    )
  }

  const hasTakenAssessment = results && results.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="PathXplore Career" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-2 mb-10">
             {hasTakenAssessment ? (
                <>
                    <h2 className="text-3xl font-bold font-headline tracking-tight">
                    Explore Your Top Career Paths
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                    Based on your InsightX Assessment, we've identified these careers
                    as a strong fit for your unique profile. Dive in to learn more
                    about each path.
                    </p>
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-bold font-headline tracking-tight">
                    Discover Your Career Matches
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                    Complete the InsightX assessment, and our AI engine will find strong career matches that truly fit you.
                    </p>
                </>
            )}
          </div>

          {hasTakenAssessment ? (
            <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.slice(0, 5).map((career, index) => ( // Show top 5
                    <CareerCard
                        key={career.careerName}
                        career={career}
                        isTopPick={index === 0}
                    />
                    ))}
                </div>

                <Card className="bg-muted/50">
                    <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <CardTitle className="font-headline">PathXplore Report &amp; Next Steps</CardTitle>
                            <CardDescription>Generate a detailed report and start planning your future.</CardDescription>
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
             <Card className="text-center p-12 border-dashed">
                <CardTitle className="font-headline mb-2">No Assessment Data Found</CardTitle>
                <CardDescription className="mb-6 max-w-md mx-auto">Please complete the InsightX Assessment to discover your personalized career paths and unlock your potential.</CardDescription>
                <Button asChild size="lg">
                    <Link href="/assessment">Take Assessment Now</Link>
                </Button>
             </Card>
          )}
        </div>
      </main>
    </div>
  );
}
