
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/loading-spinner';
import { CheckCircle } from 'lucide-react';
import { AppHeader } from '@/components/layout/app-header';

const quizQuestions = [
  {
    id: 'pq1',
    question: 'How involved are you in your child\'s career planning process?',
    options: [
      'Very involved, we discuss it regularly.',
      'Somewhat involved, I offer advice when asked.',
      'Slightly involved, I trust them to make their own choices.',
      'Not involved at all.',
    ],
  },
  {
    id: 'pq2',
    question: 'Which of these factors do you consider most important for your child\'s career?',
    options: [
      'Job stability and security.',
      'High salary and financial success.',
      'Passion and personal fulfillment.',
      'Work-life balance and well-being.',
    ],
  },
  {
    id: 'pq3',
    question: 'How would you react if your child chose a non-traditional career path (e.g., artist, entrepreneur, social worker)?',
    options: [
      'Fully supportive, as long as they are happy.',
      'Cautiously supportive, I\'d have some concerns.',
      'Slightly unsupportive, I would prefer a more stable career.',
      'Strongly unsupportive, I would try to persuade them otherwise.',
    ],
  },
  {
    id: 'pq4',
    question: 'To what extent are you willing to financially support your child\'s higher education or vocational training?',
    options: [
      'I can cover all expenses.',
      'I can contribute significantly, but they may need loans or scholarships.',
      'I can provide some support, but they will need to cover most costs.',
      'I am unable to provide financial support.',
    ],
  },
  {
    id: 'pq5',
    question: 'How important is it for your child to work in a specific geographic location (e.g., close to home)?',
    options: [
      'Very important, I want them to stay nearby.',
      'Somewhat important, but I am open to them moving for the right opportunity.',
      'Not very important, they should go wherever their career takes them.',
      'Not important at all, I encourage them to explore the world.',
    ],
  },
];

function ParentQuestionCard({
  question,
  selectedValue,
  onChange,
}: {
  question: { id: string; question: string; options: string[] };
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="font-medium mb-4">{question.question}</p>
        <RadioGroup value={selectedValue} onValueChange={onChange}>
          <div className="space-y-2">
            {question.options.map((opt, index) => (
              <Label
                key={index}
                htmlFor={`${question.id}-${index}`}
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
              >
                <RadioGroupItem value={opt} id={`${question.id}-${index}`} />
                {opt}
              </Label>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default function ParentQuizPage() {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.keys(answers).length < quizQuestions.length) {
      toast({
        variant: 'destructive',
        title: 'Incomplete Quiz',
        description: 'Please answer all questions before submitting.',
      });
      return;
    }

    setIsLoading(true);
    // In a real application, this would send the data to your backend.
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    console.log('Parent Quiz Submitted:', answers);
    
    // TODO: Implement the API call to save the parent's answers.

    setIsLoading(false);
    setIsSubmitted(true);
    toast({
      title: 'Thank You!',
      description: 'Your responses have been submitted successfully.',
    });
  };
  
  if (isSubmitted) {
    return (
        <div className="flex min-h-svh flex-1 flex-col">
            <main className="flex-1 p-4 md:p-6 lg:p-8 flex items-center justify-center">
                 <Card className="max-w-2xl w-full text-center">
                    <CardHeader>
                        <CheckCircle className="h-16 w-16 mx-auto text-green-500" />
                        <CardTitle className="font-headline text-2xl mt-4">Submission Successful</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Thank you for taking the time to provide your valuable input. Your responses will help provide a more complete picture for your child's career planning journey. You can now close this window.
                        </p>
                    </CardContent>
                 </Card>
            </main>
        </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-muted/40">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border bg-background px-4 sm:px-6">
            <h1 className="text-xl md:text-2xl font-bold font-headline text-foreground">Parent & Guardian Quiz</h1>
        </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">A Quick Survey for Parents</CardTitle>
              <CardDescription>
                Thank you for participating. Your perspective is incredibly valuable for your child's career exploration. Please answer the following questions to the best of your ability.
              </CardDescription>
            </CardHeader>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {quizQuestions.map(q => (
              <ParentQuestionCard
                key={q.id}
                question={q}
                selectedValue={answers[q.id]}
                onChange={(v) => handleAnswerChange(q.id, v)}
              />
            ))}
            
            <Card>
                <CardFooter className="p-6">
                     <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                        {isLoading ? <LoadingSpinner className="mr-2" /> : null}
                        Submit Answers
                    </Button>
                </CardFooter>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
