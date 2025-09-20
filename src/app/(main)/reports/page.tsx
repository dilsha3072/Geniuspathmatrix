
'use client';

import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

const reports = [
    {
        id: 1,
        title: "PathXplore Career Report",
        date: new Date(),
        description: "Your personalized career exploration report based on the InsightX Assessment."
    },
    // Future reports will be added here
];

export default function ReportsPage() {
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
            {reports.map((report) => (
                <Card key={report.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <CardHeader>
                        <CardTitle className="font-headline">{report.title}</CardTitle>
                        <CardDescription>Generated on {format(report.date, "PPP")}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 sm:pt-6">
                         <Button>
                            <Download className="mr-2 h-4 w-4"/>
                            Download PDF
                        </Button>
                    </CardContent>
                </Card>
            ))}
            {reports.length === 0 && (
                 <div className="text-center py-12 text-muted-foreground">
                    <p>You have not generated any reports yet.</p>
                    <p className="text-sm">Complete the assessment and generate a PathXplore report to see it here.</p>
                 </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

    