
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/loading-spinner';
import { getCareerSuggestions, sendParentQuiz } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, ArrowRight, CalendarIcon, Clock, Mail, FileCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, differenceInYears } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { getUserData } from '@/lib/actions';

const assessmentSections = [
  { id: 'personality', title: 'Personality Test', questions: 10, time: 15, instructions: 'Rate how much you agree or disagree with the following statements about yourself.' },
  { id: 'interest', title: 'Interest Profiler', questions: 10, time: 15, instructions: 'Rate how much you like or dislike the following activities.' },
  { id: 'cognitive', title: 'Cognitive & Skill Assessment', questions: 10, time: 20, instructions: 'This section has two parts. Answer the multiple-choice cognitive questions and then rate your confidence in the listed skills.' },
  { id: 'cvq', title: 'Career Values Quiz', questions: 10, time: 10, instructions: 'Rate how important the following values are to you in a career.' }
];

const assessmentQuestions = {
  personality: [
    { id: 'p1', question: 'I am the life of the party.' },
    { id: 'p2', question: 'I am always prepared.' },
    { id: 'p3', question: 'I get stressed out easily.' },
    { id: 'p4', question: 'I have a rich vocabulary.' },
    { id: 'p5', question: 'I am not interested in other people\'s problems.' },
    { id: 'p6', question: 'I leave my belongings around.' },
    { id: 'p7', question: 'I am relaxed most of the time.' },
    { id: 'p8', question: 'I have difficulty understanding abstract ideas.' },
    { id: 'p9', question: 'I feel comfortable around people.' },
    { id: 'p10', question: 'I pay attention to details.' }
  ],
  interest: [
    { id: 'i1', question: 'Building kitchen cabinets' },
    { id: 'i2', question: 'Developing a new medicine' },
    { id: 'i3', question: 'Writing books or plays' },
    { id: 'i4', question: 'Teaching school' },
    { id: 'i5', question: 'Buying and selling stocks and bonds' },
    { id: 'i6', question: 'Operating a copy machine' },
    { id: 'i7', question: 'Assembling electronic parts' },
    { id: 'i8', question: 'Doing scientific experiments' },
    { id: 'i9', question: 'Singing in a band' },
    { id: 'i10', question: 'Helping people with personal or emotional problems' }
  ],
  cognitive: [
    { id: 'c1', question: 'Which number logically follows this series? 4, 6, 9, 6, 14, 6, ...', options: ['6', '17', '19', '21'] },
    { id: 'c2', question: 'A is B\'s sister. C is B\'s mother. D is C\'s father. E is D\'s mother. Then, how is A related to D?', options: ['Grandfather', 'Grandmother', 'Daughter', 'Granddaughter'] },
    { id: 'c3', question: 'An animal shelter has a 30% discount on all cats, and a 10% discount on all dogs. If a cat costs $100 and a dog costs $150, what is the total cost for one of each?', options: ['$200', '$205', '$210', '$215'] },
    { id: 'c4', question: 'If you rearrange the letters \'CIFAIPC\' you would have the name of a(n):', options: ['City', 'Animal', 'Ocean', 'River'] },
    { id: 'c5', question: 'What is the missing number in the series? 2, 5, 10, 17, ?, 37', options: ['24', '26', '28', '30'] }
  ],
  skillMapping: [
    { id: 's1', question: 'Analyzing data and drawing conclusions' },
    { id: 's2', question: 'Leading a team to achieve a goal' },
    { id: 's3', question: 'Coming up with creative ideas' },
    { id: 's4', question: 'Organizing your work and managing time effectively' },
    { id: 's5', question: 'Persuading or influencing others' }
  ],
  cvq: [
    { id: 'v1', section: 'Independence', question: 'I want to be able to make my own decisions.' },
    { id: 'v2', section: 'Independence', question: 'I want to be able to work on my own.' },
    { id: 'v3', section: 'Support', question: 'I want a supervisor who backs up the workers with management.' },
    { id: 'v4', section: 'Support', question: 'I want the company to administer its policies fairly.' },
    { id: 'v5', section: 'Relationships', question: 'I want to have co-workers who are easy to get along with.' },
    { id: 'v6', section: 'Relationships', question: 'I want to be able to do things for other people.' },
    { id: 'v7', section: 'Working Conditions', question: 'I want to have a job where I do not have to worry about being laid off.' },
    { id: 'v8', section: 'Working Conditions', question: 'I want to be busy all the time.' },
    { id: 'v9', section: 'Achievement', question: 'I want to make use of my abilities and skills.' },
    { id: 'v10', section: 'Achievement', question: 'I want to have a sense of accomplishment from my job.' }
  ]
};

const ratingLabels = {
  personality: [
    { value: '1', label: 'Strongly Disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Agree' },
    { value: '4', label: 'Strongly Agree' },
  ],
  interest: [
    { value: '1', label: 'Strongly Dislike' },
    { value: '2', label: 'Dislike' },
    { value: '3', label: 'Like' },
    { value: '4', label: 'Strongly Like' },
  ],
  skillMapping: [
    { value: '1', label: 'Not at all confident' },
    { value: '2', label: 'Slightly confident' },
    { value: '3', label: 'Confident' },
    { value: '4', label: 'Very confident' },
  ],
  cvq: [
    { value: '1', label: 'Strongly Disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Agree' },
    { value: '4', label: 'Strongly Agree' },
  ]
};

function Timer({ secondsLeft }: { secondsLeft: number; }) {
  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;
  
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 font-mono text-lg font-semibold">
        <Clock className="h-5 w-5" />
        <span>{String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')
        }</span>
      </div>
      <p className="text-xs text-muted-foreground">Total Time: 60 minutes</p>
    </div>
  );
}

function QuestionCard({
  question,
  options,
  selectedValue,
  onChange,
}: {
  question: { id: string; question: string; options?: string[] };
  options: { value: string; label: string }[];
  selectedValue: string;
  onChange: (value: string) => void;
}) {
  const isMcq = !!question.options;
  const answerOptions = isMcq
    ? question.options!.map(opt => ({ value: opt, label: opt }))
    : options;

  return (
    <Card>
      <CardContent className="p-6">
        <p className="font-medium mb-4">{question.question}</p>
        <RadioGroup value={selectedValue} onValueChange={onChange}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {answerOptions.map(opt => (
              <Label
                key={opt.value}
                htmlFor={`${question.id}-${opt.value}`}
                className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10"
              >
                <RadioGroupItem value={opt.value} id={`${question.id}-${opt.value}`} />
                {opt.label}
              </Label>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default function AssessmentPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, Record<string, string>>>({
    personality: {},
    interest: {},
    cognitiveAbilities: {},
    selfReportedSkills: {},
    cvq: {},
  });
  const [submissionStatus, setSubmissionStatus] = React.useState<'idle' | 'submitting' | 'polling' | 'failed' | 'success'>('idle');
  const [isSendingQuiz, setIsSendingQuiz] = React.useState(false);
  const [name, setName] = React.useState('');
  const [dob, setDob] = React.useState<Date | undefined>();
  const [gender, setGender] = React.useState('');
  const [classOfStudy, setClassOfStudy] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [schoolOrCollege, setSchoolOrCollege] = React.useState('');
  const [parentEmail, setParentEmail] = React.useState('');
  const [parentPhone, setParentPhone] = React.useState('');
  const [timeLeft, setTimeLeft] = React.useState(3600); // 60 minutes in seconds
  const [isTestActive, setIsTestActive] = React.useState(false);
  const { toast } = useToast();
  
  const submittedRef = React.useRef(false);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      toast({
        title: 'Authentication Required',
        description: 'You need to be logged in to take the assessment.',
        variant: 'destructive',
      });
    }
  }, [user, authLoading, router, toast]);

  const waitForReport = React.useCallback(async (userId: string) => {
    let attempts = 0;
    const maxAttempts = 15; // Poll for 30 seconds
    while (attempts < maxAttempts) {
        const res = await getUserData(userId);
        if (res.success && res.data?.careerSuggestions) {
            console.log("Report ready!", res.data);
            return true;
        }
        attempts++;
        await new Promise(res => setTimeout(res, 2000));
    }
    return false;
  }, []);

  const handleNext = React.useCallback(() => {
    const totalSteps = assessmentSections.length + 2;
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const handleSubmit = React.useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to submit your assessment.',
      });
      submittedRef.current = false;
      return;
    }

    setIsTestActive(false);
    setSubmissionStatus('submitting');

    const formattedAnswers = {
      generalInfo: {
        name,
        dob: dob ? format(dob, 'yyyy-MM-dd') : '',
        gender,
        classOfStudy,
        place,
        schoolOrCollege,
      },
      personality: Object.entries(answers.personality).map(([k, v]) => `${assessmentQuestions.personality.find(q=>q.id===k)?.question}: ${ratingLabels.personality.find(l=>l.value===v)?.label}`).join('; '),
      interest: Object.entries(answers.interest).map(([k, v]) => `${assessmentQuestions.interest.find(q=>q.id===k)?.question}: ${ratingLabels.interest.find(l=>l.value===v)?.label}`).join('; '),
      cognitiveAbilities: Object.entries(answers.cognitiveAbilities).map(([k, v]) => `${assessmentQuestions.cognitive.find(q=>q.id===k)?.question}: ${v}`).join('; '),
      selfReportedSkills: Object.entries(answers.selfReportedSkills).map(([k, v]) => `${assessmentQuestions.skillMapping.find(q=>q.id===k)?.question}: ${ratingLabels.skillMapping.find(l=>l.value===v)?.label}`).join('; '),
      cvq: Object.entries(answers.cvq).map(([k, v]) => `${assessmentQuestions.cvq.find(q=>q.id===k)?.question}: ${ratingLabels.cvq.find(l=>l.value===v)?.label}`).join('; '),
      userId: user.uid,
    };
    
    const result = await getCareerSuggestions(formattedAnswers);
    
    if (result.success) {
      setSubmissionStatus('polling');
      const reportReady = await waitForReport(user.uid);
      if (reportReady) {
        setSubmissionStatus('success');
        router.push('/pathxplore');
      } else {
        setSubmissionStatus('failed');
        toast({
            variant: 'destructive',
            title: 'Report Generation Timed Out',
            description: "Your results are saved, but the report took too long. Please check the PathXplore page in a few minutes.",
        });
        router.push('/pathxplore'); // Still redirect so user can see results later
      }
    } else {
      setSubmissionStatus('failed');
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: result.error || 'Could not save your assessment. Please try again.',
      });
      submittedRef.current = false;
    }
  }, [user, answers, router, toast, waitForReport, name, dob, gender, classOfStudy, place, schoolOrCollege]);
  
  React.useEffect(() => {
    if (!isTestActive) return;
    
    if (timeLeft <= 0) {
      if(!submittedRef.current) {
         toast({
            title: 'Time is up!',
            description: 'Submitting your assessment automatically.',
         });
         handleSubmit();
      }
      return;
    }
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isTestActive, handleSubmit, toast]);

  React.useEffect(() => {
    if (isTestActive) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, isTestActive]);

  const handleStartAssessment = () => {
    setIsTestActive(true);
    setCurrentStep(1);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleAnswerChange = (category: string, questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [questionId]: value,
      },
    }));
  };
  
  const handleSendParentQuiz = React.useCallback(async () => {
    if (!user) return;
    setIsSendingQuiz(true);
    const result = await sendParentQuiz({ email: parentEmail, phone: parentPhone, studentId: user.uid });
    if (result.success) {
        toast({
            title: 'Quiz Sent!',
            description: result.message || 'The parent quiz has been sent successfully.',
        });
        handleNext(); // Proceed to next step after sending
    } else {
        toast({
            variant: 'destructive',
            title: 'Failed to Send',
            description: result.error || 'Could not send the parent quiz. Please check the contact details.',
        });
    }
    setIsSendingQuiz(false);
  }, [user, parentEmail, parentPhone, toast, handleNext]);
  
  if (authLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  const renderStep = () => {
    if (currentStep === 1) { // General Information Step
        const isUnder18 = dob ? differenceInYears(new Date(), dob) < 18 : false;

        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">General Information</CardTitle>
                    <CardDescription>Please provide some basic information about yourself.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !dob && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dob ? format(dob, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={dob}
                                onSelect={setDob}
                                initialFocus
                                captionLayout="dropdown-buttons"
                                fromYear={new Date().getFullYear() - 30}
                                toYear={new Date().getFullYear() - 10}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select onValueChange={setGender} value={gender}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select your gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="class-of-study">Class of Study</Label>
                            <Input id="class-of-study" placeholder="e.g., 10th Grade, Freshman" value={classOfStudy} onChange={e => setClassOfStudy(e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="place">Place</Label>
                            <Input id="place" placeholder="e.g., New York, Mumbai" value={place} onChange={e => setPlace(e.target.value)} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="school-college">School / College</Label>
                        <Input id="school-college" placeholder="Enter the name of your institution" value={schoolOrCollege} onChange={e => setSchoolOrCollege(e.target.value)} />
                    </div>
                     
                    {isUnder18 && (
                       <Card className="bg-muted/50">
                         <CardHeader>
                           <CardTitle>Parent Quiz (Optional)</CardTitle>
                           <CardDescription>
                             For a more complete profile, you can invite a parent or guardian to answer a few questions. This is completely optional and will not affect your primary results.
                           </CardDescription>
                         </CardHeader>
                         <CardContent className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="parent-email">Parent's Email</Label>
                              <Input id="parent-email" type="email" placeholder="parent@example.com" value={parentEmail} onChange={e => setParentEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="parent-phone">Parent's Phone (WhatsApp/SMS)</Label>
                              <Input id="parent-phone" type="tel" placeholder="+1234567890" value={parentPhone} onChange={e => setParentPhone(e.target.value)} />
                            </div>
                         </CardContent>
                         <CardFooter>
                           <Button onClick={handleSendParentQuiz} disabled={isSendingQuiz || (!parentEmail && !parentPhone)}>
                             {isSendingQuiz ? <LoadingSpinner className="mr-2" /> : <Mail className="mr-2" />}
                             Send Quiz & Continue
                           </Button>
                         </CardFooter>
                       </Card>
                    )}
                </CardContent>
            </Card>
        );
    }
      
    if (currentStep > 1 && currentStep <= assessmentSections.length + 1) {
      const sectionIndex = currentStep - 2;
      const section = assessmentSections[sectionIndex];
      let questionsContent;
      let questionNumberOffset = 0;
      for(let i=0; i<sectionIndex; i++) {
        questionNumberOffset += assessmentSections[i].questions;
      }
      
      switch(section.id) {
        case 'personality':
          questionsContent = assessmentQuestions.personality.map((q, i) => (
            <QuestionCard 
              key={q.id}
              question={{ ...q, question: `${questionNumberOffset + i + 1}. ${q.question}`}}
              options={ratingLabels.personality}
              selectedValue={answers.personality[q.id]}
              onChange={(v) => handleAnswerChange('personality', q.id, v)} 
            />
          ));
          break;
        case 'interest':
          questionsContent = assessmentQuestions.interest.map((q, i) => (
            <QuestionCard 
              key={q.id}
              question={{ ...q, question: `${questionNumberOffset + i + 1}. ${q.question}`}}
              options={ratingLabels.interest}
              selectedValue={answers.interest[q.id]}
              onChange={(v) => handleAnswerChange('interest', q.id, v)} 
            />
          ));
          break;
        case 'cognitive': // This is the combined Cognitive + Skill mapping section
          let questionCounter = 0;
          questionsContent = (
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-xl mb-4">Part A: Cognitive Capability</h3>
                <div className="space-y-6">
                  {assessmentQuestions.cognitive.map((q) => {
                    questionCounter++;
                    return (
                      <QuestionCard 
                        key={q.id}
                        question={{...q, question: `${questionNumberOffset + questionCounter}. ${q.question}`}}
                        options={[]} // options are in the question object for MCQ
                        selectedValue={answers.cognitiveAbilities[q.id]}
                        onChange={(v) => handleAnswerChange('cognitiveAbilities', q.id, v)} 
                      />
                    )
                  })}
                </div>
              </div>
              <div className="border-t pt-8">
                <h3 className="font-bold text-xl mb-4">Part B: Skill Mapping</h3>
                <div className="space-y-6">
                  {assessmentQuestions.skillMapping.map((q) => {
                    questionCounter++;
                    return (
                      <QuestionCard 
                        key={q.id}
                        question={{...q, question: `${questionNumberOffset + questionCounter}. ${q.question}`}}
                        options={ratingLabels.skillMapping}
                        selectedValue={answers.selfReportedSkills[q.id]}
                        onChange={(v) => handleAnswerChange('selfReportedSkills', q.id, v)} 
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          );
          break;
        case 'cvq':
          const cvqSections: {[key: string]: typeof assessmentQuestions.cvq} = {};
          assessmentQuestions.cvq.forEach(q => {
            if (!q.section) return;
            if (!cvqSections[q.section]) cvqSections[q.section] = [];
            cvqSections[q.section].push(q);
          });
          
          let cvqQuestionCounter = 0;
          questionsContent = Object.entries(cvqSections).map(([sectionTitle, qs]) => (
            <div key={sectionTitle} className="space-y-6">
              <h3 className="font-bold text-xl mb-4">{sectionTitle}</h3>
              {qs.map(q => {
                cvqQuestionCounter++;
                return (
                  <QuestionCard 
                    key={q.id}
                    question={{ ...q, question: `${questionNumberOffset + cvqQuestionCounter}. ${q.question}`}}
                    options={ratingLabels.cvq}
                    selectedValue={answers.cvq[q.id]}
                    onChange={(v) => handleAnswerChange('cvq', q.id, v)} 
                  />
                );
              })}
            </div>
          ));
          break;
        default:
          return null;
      }
      return (
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="font-headline">{section.title}</CardTitle>
              <CardDescription>{section.instructions}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            {questionsContent}
          </CardContent>
        </Card>
      );
    }

    const totalQuestions = assessmentSections.reduce((total, section) => total + section.questions, 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Welcome to the InsightX Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">General Instructions:</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                        <li>For students of 13-19 age group: Discover Your Unique Potential</li>
                        <li>This assessment is designed to help you understand your unique personality, interests, and cognitive strengths. There are no right or wrong answers. Answer honestly based on how you truly feel or typically behave.</li>
                        <li>The assessment consists of {totalQuestions} questions divided into {assessmentSections.length} sections.</li>
                        <li>A continuous timer of 60 minutes is set for the entire assessment.</li>
                        <li>Once you start, the timer will not stop. If you leave the page, the timer will continue. The assessment will auto-submit when the time is up.</li>
                        <li>Read each question carefully.</li>
                        <li>Choose the option that best describes you or your answer.</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Exam Structure Overview:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assessmentSections.map((section, index) => (
                            <div key={index} className="p-4 bg-muted/50 rounded-lg">
                                <h4 className="font-semibold">Section {index + 1}: {section.title}</h4>
                                <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    <li>Number of Questions: {section.questions}</li>
                                    <li>Approximate Time: {section.time} Minutes</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                
                 <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Honesty is Key!</AlertTitle>
                    <AlertDescription>
                      For the most accurate results, please answer all questions as honestly as possible.
                    </AlertDescription>
                </Alert>
            </CardContent>
             <CardFooter>
                <Button onClick={handleStartAssessment} className="w-full" size="lg">Start Assessment</Button>
            </CardFooter>
        </Card>
    );
  };
  
  const isLastAssessmentStep = currentStep === assessmentSections.length + 1;
  const isGeneralInfoStep = currentStep === 1;

  const isLoading = submissionStatus === 'submitting' || submissionStatus === 'polling';
  const loadingText = submissionStatus === 'submitting' 
    ? "Submitting your answers..." 
    : "Analyzing your profile and generating your report...";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="InsightX Assessment" />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        {submissionStatus !== 'idle' && submissionStatus !== 'failed' ? (
           <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <LoadingSpinner className="w-12 h-12 text-primary"/>
              <h2 className="text-2xl font-bold font-headline">{loadingText}</h2>
              <p className="text-muted-foreground max-w-md">
                {submissionStatus === 'polling' 
                    ? "Our AI is crunching the numbers to find your perfect career matches. This might take a moment."
                    : "Please wait while we securely save your assessment responses."
                }
              </p>
           </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {isTestActive && (
              <Card className="sticky top-16 z-20">
                <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex-1 space-y-2">
                      <Progress value={((currentStep - 1) / assessmentSections.length) * 100} className="w-full" />
                      <p className="text-center text-sm text-muted-foreground">Section {currentStep - 1} of {assessmentSections.length}</p>
                    </div>
                    <div className="w-px bg-border h-10 mx-6"></div>
                    <Timer secondsLeft={timeLeft} />
                </CardContent>
              </Card>
            )}
            
            {renderStep()}
            
            {isTestActive && (
                <div className="flex justify-between items-center mt-6">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep <= 1}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    {isLastAssessmentStep ? (
                        <Button onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? <LoadingSpinner className="mr-2"/> : <FileCheck className="mr-2" />}
                            Submit & Get My Results
                        </Button>
                    ) : (
                        <Button onClick={handleNext} size="lg" disabled={isGeneralInfoStep && (!dob || !gender || !name)}>
                            Next Section <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            )}

          </div>
        )}
      </main>
    </div>
  );
}

    