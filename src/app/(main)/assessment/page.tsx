'use client';

import * as React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/loading-spinner';
import { getCareerSuggestions, generateSwotAnalysis } from '@/lib/actions';
import type { CareerSuggestion, SwotAnalysis } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, ArrowRight, Lightbulb, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const totalSteps = 4;

const assessmentQuestions = {
  personality: [
    { id: 'p1', question: 'I see myself as someone who is outgoing, sociable.' },
    { id: 'p2', question: 'I tend to be compassionate and cooperative.' },
    { id: 'p3', question: 'I am a reliable, well-organized person.' },
    { id: 'p4', question: 'I get nervous easily.' },
    { id: 'p5', question: 'I have an active imagination.' },
  ],
  interest: [
    { id: 'i1', question: 'I enjoy working with my hands and tools.' },
    { id: 'i2', question: 'I like to solve complex problems.' },
    { id: 'i3', question: 'I am drawn to artistic and creative activities.' },
    { id: 'i4', question: 'I enjoy helping people and teaching.' },
    { id: 'i5', question: 'I am good at persuading and leading others.' },
  ],
  cognitive: [
    { id: 'c1', question: 'Which number is next in the series: 2, 4, 8, 16, ?' },
    { id: 'c2', question: 'Apple is to fruit as cabbage is to ______.' },
    { id: 'c3', question: 'Identify the pattern and select the missing shape.' },
  ],
};


function SwotDialog({ career, skills }: { career: CareerSuggestion, skills: string }) {
  const [analysis, setAnalysis] = React.useState<SwotAnalysis | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleOpen = async () => {
    if (analysis) return;
    setIsLoading(true);
    const result = await generateSwotAnalysis({ careerName: career.careerName, studentSkills: skills.split(',') });
    if (result.success) {
      setAnalysis(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog onOpenChange={(open) => open && handleOpen()}>
      <DialogTrigger asChild>
        <Button variant="secondary">View SWOT Analysis</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">SWOT Analysis: {career.careerName}</DialogTitle>
          <DialogDescription>
            An AI-generated analysis based on your profile.
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <LoadingSpinner className="h-8 w-8" />
          </div>
        ) : analysis ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <Card>
              <CardHeader className="flex-row gap-4 items-center">
                <ThumbsUp className="h-8 w-8 text-green-500" />
                <CardTitle>Strengths</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{analysis.strengths}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row gap-4 items-center">
                <ThumbsDown className="h-8 w-8 text-red-500" />
                <CardTitle>Weaknesses</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{analysis.weaknesses}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row gap-4 items-center">
                <Lightbulb className="h-8 w-8 text-blue-500" />
                <CardTitle>Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{analysis.opportunities}</CardContent>
            </Card>
            <Card>
              <CardHeader className="flex-row gap-4 items-center">
                <Zap className="h-8 w-8 text-yellow-500" />
                <CardTitle>Threats</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{analysis.threats}</CardContent>
            </Card>
          </div>
        ) : <p>Could not load analysis.</p>}
      </DialogContent>
    </Dialog>
  );
}


function CareerResults({ suggestions, userSkills, onReset }: { suggestions: CareerSuggestion[], userSkills: string, onReset: () => void }) {
  return (
    <div className="space-y-8">
       <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-headline tracking-tight">Your AI-Matched Careers</h2>
          <p className="text-muted-foreground">Based on your assessment, here are your top career suggestions.</p>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((career) => (
          <Card key={career.careerName} className="flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline">{career.careerName}</CardTitle>
              <CardDescription className="line-clamp-3">{career.careerDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
               <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: career.swotAnalysis.replace(/\n/g, '<br />') }}></div>
            </CardContent>
            <CardFooter className="flex justify-between">
               <Button>View Details</Button>
               <SwotDialog career={career} skills={userSkills} />
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center">
         <Button variant="outline" onClick={onReset}>Take Assessment Again</Button>
      </div>
    </div>
  );
}


export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState({
    personality: '',
    interest: '',
    cognitiveAbilities: '',
    selfReportedSkills: '',
    cvq: 'Sample CVQ data',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<CareerSuggestion[] | null>(null);
  const { toast } = useToast();

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  const handleValueChange = (category: keyof typeof formData, value: string) => {
    setFormData(prev => ({...prev, [category]: value}));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const result = await getCareerSuggestions(formData);
    if (result.success && result.data) {
      setResults(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: result.error || 'Could not generate career suggestions. Please try again.',
      });
    }
    setIsLoading(false);
  };
  
  const resetAssessment = () => {
    setResults(null);
    setCurrentStep(1);
    setFormData({ personality: '', interest: '', cognitiveAbilities: '', selfReportedSkills: '', cvq: 'Sample CVQ data' });
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Personality (Big Five - OCEAN)</h3>
            {assessmentQuestions.personality.map(q => (
              <div key={q.id}>
                <p className="mb-2">{q.question}</p>
                <RadioGroup onValueChange={(v) => handleValueChange('personality', formData.personality + ` ${q.id}:${v}`)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="1" id={`${q.id}-1`}/><Label htmlFor={`${q.id}-1`}>Disagree</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="3" id={`${q.id}-3`}/><Label htmlFor={`${q.id}-3`}>Neutral</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="5" id={`${q.id}-5`}/><Label htmlFor={`${q.id}-5`}>Agree</Label></div>
                </RadioGroup>
              </div>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Interest (RIASEC)</h3>
            {assessmentQuestions.interest.map(q => (
              <div key={q.id}>
                <p className="mb-2">{q.question}</p>
                <RadioGroup onValueChange={(v) => handleValueChange('interest', formData.interest + ` ${q.id}:${v}`)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="no" id={`${q.id}-no`}/><Label htmlFor={`${q.id}-no`}>No</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id={`${q.id}-yes`}/><Label htmlFor={`${q.id}-yes`}>Yes</Label></div>
                </RadioGroup>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Cognitive Capabilities (VAT)</h3>
            {assessmentQuestions.cognitive.map(q => (
              <div key={q.id}>
                <p className="mb-2">{q.question}</p>
                <RadioGroup onValueChange={(v) => handleValueChange('cognitiveAbilities', formData.cognitiveAbilities + ` ${q.id}:${v}`)} className="flex gap-4">
                   <div className="flex items-center space-x-2"><RadioGroupItem value="a" id={`${q.id}-a`}/><Label htmlFor={`${q.id}-a`}>Option A</Label></div>
                   <div className="flex items-center space-x-2"><RadioGroupItem value="b" id={`${q.id}-b`}/><Label htmlFor={`${q.id}-b`}>Option B</Label></div>
                   <div className="flex items-center space-x-2"><RadioGroupItem value="c" id={`${q.id}-c`}/><Label htmlFor={`${q.id}-c`}>Option C</Label></div>
                </RadioGroup>
              </div>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Self-Reported Skills</h3>
            <p className="text-sm text-muted-foreground">List skills you believe you possess. e.g., Python, public speaking, video editing.</p>
            <Textarea 
              placeholder="Enter your skills, separated by commas..."
              rows={6}
              value={formData.selfReportedSkills}
              onChange={(e) => handleValueChange('selfReportedSkills', e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="InsightX Assessment" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {isLoading ? (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <LoadingSpinner className="w-12 h-12 text-primary"/>
              <h2 className="text-2xl font-bold font-headline">Analyzing Your Profile...</h2>
              <p className="text-muted-foreground max-w-md">Our AI is crunching the numbers to find your perfect career matches. This might take a moment.</p>
           </div>
        ) : results ? (
           <CareerResults suggestions={results} userSkills={formData.selfReportedSkills} onReset={resetAssessment} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
               <div className="text-center space-y-2">
                  <h2 className="text-3xl font-bold font-headline tracking-tight">Discover Your Path</h2>
                  <p className="text-muted-foreground">Complete the following sections to get personalized career suggestions.</p>
                </div>
              <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
              <p className="text-center text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</p>
            </div>
            
            <Card>
              <CardContent className="p-6 md:p-8">
                {renderStep()}
              </CardContent>
            </Card>
            
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <LoadingSpinner className="mr-2"/> : 'Get My Results'}
                </Button>
              )}
            </div>
            
             <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Honesty is Key!</AlertTitle>
                <AlertDescription>
                  For the most accurate results, please answer all questions as honestly as possible.
                </AlertDescription>
            </Alert>
          </div>
        )}
      </main>
    </div>
  );
}
