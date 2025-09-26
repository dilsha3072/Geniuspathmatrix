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
import { AlertCircle, ArrowLeft, ArrowRight, CalendarIcon, Clock, Mail } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format, differenceInYears } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';

const assessmentSections = [
  {
    id: 'personality',
    title: 'Personality Assessment',
    questions: 30,
    time: 15,
    instructions: 'Rate how much each statement describes you on a scale of 1 (Disagree) to 4 (Agree).',
  },
  {
    id: 'interest',
    title: 'Interest Inventory',
    questions: 20,
    time: 10,
    instructions: 'Indicate how much you would enjoy performing each activity on a scale of 1 (Dislike) to 4 (Like).',
  },
  {
    id: 'cognitive',
    title: 'Cognitive Capability + Skill Mapping',
    questions: 20, // 10 cognitive + 10 skill mapping
    time: 20,
    instructions: 'This section has two parts. First, answer cognitive ability questions. Then, self-assess your skills.',
  },
  {
    id: 'cvq',
    title: 'Contextual Viability Quotient (CVQ™)',
    questions: 25,
    time: 15,
    instructions: 'Rate how much you agree with each statement on a scale of 1 (Disagree) to 4 (Agree) for your top career choice.',
  },
];

const totalSteps = assessmentSections.length + 2; // +1 for instructions, +1 for general info

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

const assessmentQuestions = {
  personality: [
    { id: 'p1', question: 'I enjoy being the center of attention in a group.' },
    { id: 'p2', question: 'I make sure my school assignments are neat and organized.' },
    { id: 'p3', question: 'I love learning about new and unusual things.' },
    { id: 'p4', question: 'I sometimes get anxious or worried about small things.' },
    { id: 'p5', question: 'I try to be kind and considerate to everyone.' },
    { id: 'p6', question: 'I always finish what I start, even if it\'s difficult.' },
    { id: 'p7', question: 'I often come up with creative ideas for school projects or hobbies.' },
    { id: 'p8', question: 'I am reliable and people can count on me.' },
    { id: 'p9', question: 'I am good at understanding how others are feeling.' },
    { id: 'p10', question: 'I tend to overthink things and get stressed.' },
    { id: 'p11', question: 'I like to explore different cultures and ideas.' },
    { id: 'p12', question: 'I enjoy taking charge when working on a group project.' },
    { id: 'p13', question: 'I believe most people are honest and trustworthy.' },
    { id: 'p14', question: 'I set high standards for myself in schoolwork.' },
    { id: 'p15', question: 'I feel energized when I\'m around a lot of people.' },
    { id: 'p16', question: 'I sometimes feel overwhelmed by my emotions.' },
    { id: 'p17', question: 'I am very imaginative and like to daydream.' },
    { id: 'p18', question: 'I prefer to stick to a schedule and routine.' },
    { id: 'p19', question: 'I usually stay calm, even in stressful situations.' },
    { id: 'p20', question: 'I prefer to spend my free time alone or with a few close friends.' },
    { id: 'p21', question: 'I enjoy expressing myself through art, music, or writing.' },
    { id: 'p22', question: 'I can usually handle unexpected problems without getting upset.' },
    { id: 'p23', question: 'I like to think deeply about complex ideas.' },
    { id: 'p24', question: 'I enjoy helping my friends or family when they have a problem.' },
    { id: 'p25', question: 'My room or study space is often a bit messy.' },
    { id: 'p26', question: 'I am curious about how things work and why people behave the way they do.' },
    { id: 'p27', question: 'I prefer to work independently on school projects.' },
    { id: 'p28', question: 'I get annoyed easily by small things.' },
    { id: 'p29', question: 'I respect traditional ways of doing things.' },
    { id: 'p30', question: 'I learn new things quickly.' },
  ],
  interest: [
    { id: 'i1', question: 'Creating a new game or app idea for my phone.' },
    { id: 'i2', question: 'Mentoring a younger student or helping a classmate with their studies.' },
    { id: 'i3', question: 'Building or fixing things with my hands (e.g., models, electronics).' },
    { id: 'i4', question: 'Organizing a school event or a group project.' },
    { id: 'i5', question: 'Conducting experiments in a science lab.' },
    { id: 'i6', question: 'Writing stories, poems, or creating digital art.' },
    { id: 'i7', question: 'Keeping my notes and files perfectly organized.' },
    { id: 'i8', question: 'Volunteering for a community service project.' },
    { id: 'i9', question: 'Learning how machines or devices work.' },
    { id: 'i10', question: 'Leading a club or a school group.' },
    { id: 'i11', question: 'Researching a topic in depth for a school report.' },
    { id: 'i12', question: 'Performing in a play, band, or debate.' },
    { id: 'i13', question: 'Working with numbers and keeping track of finances (e.g., for a school club).' },
    { id: 'i14', question: 'Helping people who are facing difficulties.' },
    { id: 'i15', question: 'Designing and building something physical (e.g., a robot, a craft).' },
    { id: 'i16', question: 'Convincing others to support an idea or project.' },
    { id: 'i17', question: 'Solving complex math problems or logic puzzles.' },
    { id: 'i18', question: 'Expressing my thoughts clearly in written essays or presentations.' },
    { id: 'i19', question: 'Working with plants or animals in a garden or farm.' },
    { id: 'i20', question: 'Imagining new inventions or solutions to problems.' },
  ],
  cognitive: [
      { id: 'cog1', question: 'Which word is the odd one out:', options: ['Apple', 'Banana', 'Carrot', 'Orange'] },
      { id: 'cog2', question: 'Complete the series: 2, 4, 8, 16, ?', options: ['20', '24', '32', '36'] },
      { id: 'cog3', question: 'If a bird is to flying as a fish is to ____?', options: ['Swimming', 'Jumping', 'Eating', 'Singing'] },
      { id: 'cog4', question: 'Which shape comes next in the sequence: Triangle, Square, Pentagon, ?', options: ['Hexagon', 'Heptagon', 'Circle', 'Star'] },
      { id: 'cog5', question: 'A cyclist travels 10 km in 20 minutes. How far will they travel in 1 hour?', options: ['10 km', '20 km', '30 km', '40 km'] },
      { id: 'cog6', question: 'Find the missing number: 1, 3, 6, 10, ?', options: ['13', '14', '15', '16'] },
      { id: 'cog7', question: 'Which word is the odd one out:', options: ['Book', 'Pen', 'Eraser', 'Desk'] },
      { id: 'cog8', question: 'If all students are learners, and all learners are curious, then all students are curious. True or False?', options: ['True', 'False', 'Cannot Say', 'Irrelevant'] },
      { id: 'cog9', question: 'Which of the following is the next logical step in the pattern: AB, CD, EF, GH, ?', options: ['IJ', 'KL', 'JK', 'HI'] },
      { id: 'cog10', question: 'If you rearrange the letters \'TINAP\', you would have the name of a(n):', options: ['Animal', 'Fruit', 'Color', 'Country'] },
  ],
  skillMapping: [
      { id: 'sm1', question: 'I am confident sharing my ideas in front of my class.' },
      { id: 'sm2', question: 'I can quickly figure out how to use a new app or software.' },
      { id: 'sm3', question: 'I am good at explaining difficult topics to my friends.' },
      { id: 'sm4', question: 'I often think of unique ways to do school projects.' },
      { id: 'sm5', question: 'I keep my school bag and study area organized.' },
      { id: 'sm6', question: 'I enjoy working with others on group assignments.' },
      { id: 'sm7', question: 'I am good at solving brain teasers or riddles.' },
      { id: 'sm8', question: 'I can adjust easily when plans change unexpectedly.' },
      { id: 'sm9', question: 'I am good at writing clear and persuasive essays.' },
      { id: 'sm10', question: 'I feel comfortable giving presentations or speeches.' },
  ],
  cvq: [
    { id: 'cvq1', section: 'Cultural & Societal Compatibility', question: 'I am free to pursue any career, regardless of family traditions or expectations.' },
    { id: 'cvq2', section: 'Cultural & Societal Compatibility', question: 'My family does not interfere in my career decision-making.' },
    { id: 'cvq3', section: 'Cultural & Societal Compatibility', question: 'Society in my region encourages diversity in career choices.' },
    { id: 'cvq4', section: 'Cultural & Societal Compatibility', question: 'I feel confident resisting social pressure when choosing my career.' },
    { id: 'cvq5', section: 'Cultural & Societal Compatibility', question: 'I know people in my community who’ve followed careers different from what was expected of them.' },
    { id: 'cvq6', section: 'Language Readiness (Current + Future)', question: 'I can currently read, write, and speak in English or the required career language.' },
    { id: 'cvq7', section: 'Language Readiness (Current + Future)', question: 'I understand lectures, videos, or tutorials in English without needing translations.' },
    { id: 'cvq8', section: 'Language Readiness (Current + Future)', question: 'I believe I can become fluent in English or another required language within 2 years.' },
    { id: 'cvq9', section: 'Language Readiness (Current + Future)', question: 'I would avoid certain careers due to language limitations. (reverse scored)' },
    { id: 'cvq10', section: 'Language Readiness (Current + Future)', question: 'I am confident in my ability to clear language-based entrance tests or interviews.' },
    { id: 'cvq11', section: 'Digital Access & Tech Confidence', question: 'I have regular access to a smartphone with internet.' },
    { id: 'cvq12', section: 'Digital Access & Tech Confidence', question: 'I have access to a laptop or desktop at least 3 days per week.' },
    { id: 'cvq13', section: 'Digital Access & Tech Confidence', question: 'I feel confident using online learning platforms and productivity tools.' },
    { id: 'cvq14', section: 'Digital Access & Tech Confidence', question: 'My learning or career progress is affected due to poor digital access. (reverse scored)' },
    { id: 'cvq15', section: 'Digital Access & Tech Confidence', question: 'I know how to register for online certifications or attend virtual internships.' },
    { id: 'cvq16', section: 'Financial & Geographic Readiness', question: 'I can afford entrance or coaching exam fees over the next year.' },
    { id: 'cvq17', section: 'Financial & Geographic Readiness', question: 'My financial situation may limit my choice of college or career options. (reverse scored)' },
    { id: 'cvq18', section: 'Financial & Geographic Readiness', question: 'I am willing to apply for scholarships or part-time jobs to support my career goals.' },
    { id: 'cvq19', section: 'Financial & Geographic Readiness', question: 'I am willing to relocate to another city/state/country for education or work.' },
    { id: 'cvq20', section: 'Financial & Geographic Readiness', question: 'My family is likely to support me if relocation becomes necessary.' },
    { id: 'cvq21', section: 'Parental & Familial Support', question: 'My parents have a specific career path in mind for me that differs from my interests.' },
    { id: 'cvq22', section: 'Parental & Familial Support', question: 'My family considers job stability and a high salary to be the most important factors in a career.' },
    { id: 'cvq23', section: 'Parental & Familial Support', question: 'I feel comfortable discussing my career aspirations openly with my parents.' },
    { id: 'cvq24', section: 'Parental & Familial Support', question: 'My parents are actively involved in my educational and career planning.' },
    { id: 'cvq25', section: 'Parental & Familial Support', question: 'My family would support my choice to pursue a non-traditional career path (e.g., in arts, entrepreneurship).' },
  ]
};

function Timer({ secondsLeft, totalSeconds }: { secondsLeft: number; totalSeconds: number; }) {
  const displayMinutes = Math.floor(secondsLeft / 60);
  const displaySeconds = secondsLeft % 60;
  
  const totalMinutes = Math.floor(totalSeconds / 60);

  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 font-mono text-lg font-semibold">
        <Clock className="h-5 w-5" />
        <span>{String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}</span>
      </div>
      <p className="text-xs text-muted-foreground">Total Time: {totalMinutes} minutes</p>
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSendingQuiz, setIsSendingQuiz] = React.useState(false);
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
  
  React.useEffect(() => {
    if (!isTestActive) return;
    
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isTestActive]);

  const handleStartAssessment = () => {
    setIsTestActive(true);
    setCurrentStep(1);
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleAnswerChange = (category: string, questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [questionId]: value,
      },
    }));
  };
  
  const handleSendParentQuiz = async () => {
    setIsSendingQuiz(true);
    const result = await sendParentQuiz({ email: parentEmail, phone: parentPhone });
    if (result.success) {
        toast({
            title: 'Quiz Sent!',
            description: result.message || 'The parent quiz has been sent successfully.',
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Failed to Send',
            description: result.error || 'Could not send the parent quiz. Please check the contact details.',
        });
    }
    setIsSendingQuiz(false);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You must be logged in to submit your assessment.',
      });
      return;
    }
    setIsTestActive(false);
    setIsLoading(true);

    const formattedAnswers = {
      personality: Object.entries(answers.personality).map(([k, v]) => `${assessmentQuestions.personality.find(q=>q.id===k)?.question}: ${ratingLabels.personality.find(l=>l.value===v)?.label}`).join('; '),
      interest: Object.entries(answers.interest).map(([k, v]) => `${assessmentQuestions.interest.find(q=>q.id===k)?.question}: ${ratingLabels.interest.find(l=>l.value===v)?.label}`).join('; '),
      cognitiveAbilities: Object.entries(answers.cognitiveAbilities).map(([k, v]) => `${assessmentQuestions.cognitive.find(q=>q.id===k)?.question}: ${v}`).join('; '),
      selfReportedSkills: Object.entries(answers.selfReportedSkills).map(([k, v]) => `${assessmentQuestions.skillMapping.find(q=>q.id===k)?.question}: ${ratingLabels.skillMapping.find(l=>l.value===v)?.label}`).join('; '),
      cvq: Object.entries(answers.cvq).map(([k, v]) => `${assessmentQuestions.cvq.find(q=>q.id===k)?.question}: ${ratingLabels.cvq.find(l=>l.value===v)?.label}`).join('; '),
      userId: user.uid,
    };
    
    const result = await getCareerSuggestions(formattedAnswers);
    
    if (result.success && result.data) {
      router.push('/pathxplore');
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: result.error || 'Could not generate career suggestions. Please try again.',
      });
      setIsLoading(false);
    }
  };
  
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
                             Send Parent Quiz
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
        let questionCount = 0;
        if (assessmentSections[i].id === 'cvq') {
          questionCount = 25; // Manually set for cvq with added questions
        } else {
          questionCount = assessmentSections[i].questions;
        }
        questionNumberOffset += questionCount;
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
          let cognitiveQuestionCounter = 0;
          questionsContent = (
            <div className="space-y-8">
              <div>
                <h3 className="font-bold text-xl mb-4">Part A: Cognitive Capability</h3>
                <div className="space-y-6">
                  {assessmentQuestions.cognitive.map((q) => {
                    cognitiveQuestionCounter++;
                    return (
                      <QuestionCard 
                        key={q.id}
                        question={{...q, question: `${questionNumberOffset + cognitiveQuestionCounter}. ${q.question}`}}
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
                    cognitiveQuestionCounter++;
                    return (
                      <QuestionCard 
                        key={q.id}
                        question={{...q, question: `${questionNumberOffset + cognitiveQuestionCounter}. ${q.question}`}}
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
            if (!cvqSections[q.section]) cvqSections[q.section] = [];
            cvqSections[q.section].push(q);
          });
          
          let questionCounter = 0;
          questionsContent = Object.entries(cvqSections).map(([sectionTitle, qs]) => (
            <div key={sectionTitle} className="space-y-6">
              <h3 className="font-bold text-xl mb-4">{sectionTitle}</h3>
              {qs.map(q => {
                questionCounter++;
                return (
                  <QuestionCard 
                    key={q.id}
                    question={{ ...q, question: `${questionNumberOffset + questionCounter}. ${q.question}`}}
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
    const totalTime = assessmentSections.reduce((total, section) => total + section.time, 0);

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
                        <li>The total time allotted for the assessment is {totalTime} minutes.</li>
                        <li>Each section has a specific time limit. You must complete all questions within a section before its time limit expires or you move to the next section.</li>
                        <li>Once you complete a section and move to the next, you will not be able to go back to previous sections.</li>
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
                                    <li>Time Allotment: {section.time} Minutes</li>
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
                    <Timer secondsLeft={timeLeft} totalSeconds={3600} />
                </CardContent>
              </Card>
            )}
            
            {renderStep()}
            
            {isTestActive && (
                <div className="flex justify-between items-center mt-6">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 0 || currentStep === 1}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    {isLastAssessmentStep ? (
                        <Button onClick={handleSubmit} disabled={isLoading} size="lg">
                            {isLoading ? <LoadingSpinner className="mr-2"/> : 'Get My Results'}
                        </Button>
                    ) : (
                        <Button onClick={handleNext} size="lg" disabled={isGeneralInfoStep && (!dob || !gender)}>
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
