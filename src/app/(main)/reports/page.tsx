
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/auth-context';
import { getUserData, getAppData } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ReportInfo } from '@/lib/types';

export default function ReportsPage() {
  const [reports, setReports] = React.useState<ReportInfo[]>([]);
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    async function loadData() {
        if(authLoading) return;

        setIsLoading(true);
        try {
            const appDataRes = await getAppData('reports');
            const initialReports: Omit<ReportInfo, 'date' | 'isAvailable'>[] = appDataRes.data?.list || [];

            if (!user) {
                setReports(initialReports.map(r => ({...r, date: null, isAvailable: false})));
                setIsLoading(false);
                return;
            }

            const userRes = await getUserData(user.uid);
            const hasAssessmentData = !!userRes.data?.careerSuggestions;
            const hasGoalPlan = !!userRes.data?.goalPlan;
            const generationDate = userRes.data?.assessment?.updatedAt ? new Date(userRes.data.assessment.updatedAt) : new Date();

            setReports(initialReports.map(report => {
                let isAvailable = false;
                if (report.requiresAssessment) isAvailable = hasAssessmentData;
                if (report.requiresGoalPlan) isAvailable = hasGoalPlan && hasAssessmentData;

                return { 
                    ...report, 
                    date: isAvailable ? generationDate : null,
                    isAvailable: isAvailable,
                }
            }));

        } catch (e) {
            toast({
              variant: 'destructive',
              title: 'Could not load data',
              description: 'There was a problem loading your user data.',
            });
            setReports([]);
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, [user, authLoading, toast]);
  
  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Generating Report",
      description: `Your "${reportTitle}" is being generated and will be downloaded shortly.`,
    });
    // In a real app, this would trigger a call to a PDF generation service.
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Reports" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-1 mb-8">
            <h2 className="text-3xl font-bold font-headline tracking-tight">Your Generated Reports</h2>
            <p className="text-muted-foreground">Download and review your personalized reports at any time.</p>
          </div>
          
          <div className="space-y-4">
             {isLoading ? (
                Array.from({length: 4}).map((_, i) => (
                    <Card key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-32 mt-1" />
                        </CardHeader>
                        <CardContent className="p-6 pt-0 sm:pt-6">
                            <Skeleton className="h-10 w-36" />
                        </CardContent>
                    </Card>
                ))
            ) : (
                <TooltipProvider>
                    {reports.map((report) => (
                        <Card key={report.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <CardHeader>
                                <CardTitle className="font-headline">{report.title}</CardTitle>
                                {report.isAvailable && report.date ? (
                                    <CardDescription>Generated on {format(report.date, "PPP")}</CardDescription>
                                ) : (
                                    <CardDescription>Data not yet available for this report.</CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="p-6 pt-0 sm:pt-6">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="inline-block">
                                            <Button 
                                                onClick={() => handleDownload(report.title)} 
                                                disabled={!report.isAvailable}
                                            >
                                                <Download className="mr-2 h-4 w-4"/>
                                                Download PDF
                                            </Button>
                                        </div>
                                    </TooltipTrigger>
                                    {!report.isAvailable && (
                                        <TooltipContent>
                                            { report.requiresGoalPlan 
                                                ? <p>Generate a GoalMint Plan to unlock this report.</p>
                                                : <p>Complete the InsightX Assessment to unlock this report.</p>
                                            }
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </CardContent>
                        </Card>
                    ))}
                </TooltipProvider>
            )}

            {!isLoading && !user && (
                <Card className="border-dashed mt-8">
                    <CardHeader className="text-center items-center">
                        <Info className="h-8 w-8 text-muted-foreground" />
                        <CardTitle>Please Log In</CardTitle>
                        <CardDescription>Log in to view and download your reports.</CardDescription>
                    </CardHeader>
                </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
