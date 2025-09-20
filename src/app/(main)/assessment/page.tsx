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
import { AlertCircle, ArrowLeft, ArrowRight, Lightbulb, ThumbsDown, ThumbsUp, Zap, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const assessmentSections = [
  {
    title: 'Personality Assessment',
    questions: 30,
    time: 20,
    instructions: 'Rate how much each statement describes you on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree).',
  },
  {
    title: 'Interest Inventory',
    questions: 20,
    time: 15,
    instructions: 'Indicate how much you would enjoy performing each activity on a scale of 1 (Strongly Dislike) to 5 (Strongly Like).',
  },
  {
    title: 'Cognitive Capability + Skill Mapping',
    questions: 50,
    time: 30,
    instructions: 'This section has two parts. First, answer 30 cognitive ability questions (these require quick and accurate thinking). Then, self-assess your skills with 20 skill mapping questions.',
  },
  {
    title: 'Contextual Viability Quotient (CVQ™)',
    questions: 20,
    time: 25,
    instructions: 'Rate how much you agree with each statement on a scale of 1 (Strongly Disagree) to 5 (Strongly Agree) for your top career choice.',
  },
];

const totalSteps = assessmentSections.length + 1; // +1 for the initial instructions screen

const ratingLabels = {
  '1-5': [
    { value: '1', label: 'Strongly Disagree' },
    { value: '2', label: 'Disagree' },
    { value: '3', label: 'Neutral' },
    { value: '4', label: 'Agree' },
    { value: '5', label: 'Strongly Agree' },
  ],
  'like-1-5': [
    { value: '1', label: 'Strongly Dislike' },
    { value: '2', label: 'Dislike' },
    { value: '3', label: 'Neutral' },
    { value: '4', label: 'Like' },
    { value: '5', label: 'Strongly Like' },
  ],
  'confidence-1-5': [
    { value: '1', label: 'Not at all confident/proficient' },
    { value: '2', label: '' },
    { value: '3', label: '' },
    { value: '4', label: '' },
    { value: '5', label: 'Very confident/proficient' },
  ],
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
      { id: 'cog1', question: 'Which word is the odd one out: Apple, Banana, Carrot, Orange, Grape?', options: ['Apple', 'Banana', 'Carrot', 'Orange', 'Grape'] },
      { id: 'cog2', question: 'Complete the series: 2, 4, 8, 16, ?', options: ['20', '24', '32', '36'] },
      { id: 'cog3', question: 'If a bird is to flying as a fish is to ____?', options: ['Swimming', 'Jumping', 'Eating', 'Singing'] },
      { id: 'cog4', question: 'Which shape comes next in the sequence: Triangle, Square, Pentagon, Hexagon, ?', options: ['Heptagon', 'Octagon', 'Circle', 'Star'] },
      { id: 'cog5', question: 'A cyclist travels 10 km in 20 minutes. How far will they travel in 1 hour?', options: ['10 km', '20 km', '30 km', '40 km'] },
      { id: 'cog6', question: 'Find the missing number: 1, 3, 6, 10, ?', options: ['13', '14', '15', '16'] },
      { id: 'cog7', question: 'Which word is the odd one out: Book, Pen, Pencil, Eraser, Desk?', options: ['Book', 'Pen', 'Pencil', 'Eraser', 'Desk'] },
      { id: 'cog8', question: 'If all students are learners, and all learners are curious, then all students are curious. True or False?', options: ['True', 'False'] },
      { id: 'cog9', question: 'Which of the following is the next logical step in the pattern: AB, CD, EF, GH, ?', options: ['IJ', 'KL', 'JK', 'HI'] },
      { id: 'cog10', question: 'If you rearrange the letters \'TINAP\', you would have the name of a(n):', options: ['Animal', 'Fruit', 'Color', 'Country'] },
      { id: 'cog11', question: 'A recipe calls for 2 cups of flour for 8 cookies. How much flour is needed for 16 cookies?', options: ['2 cups', '3 cups', '4 cups', '6 cups'] },
      { id: 'cog12', question: 'Which word is the opposite of \'Brave\': Fearful, Strong, Bold, Heroic?', options: ['Fearful', 'Strong', 'Bold', 'Heroic'] },
      { id: 'cog13', question: 'If a baker can decorate 12 cakes in 3 hours, how many cakes can they decorate in 1 hour?', options: ['3 cakes', '4 cakes', '6 cakes', '12 cakes'] },
      { id: 'cog14', question: 'Complete the sequence: Z, X, V, T, ?', options: ['S', 'U', 'R', 'Q'] },
      { id: 'cog15', question: 'Which of these is an even number: 5, 7, 9, 10?', options: ['5', '7', '9', '10'] },
      { id: 'cog16', question: 'Rahul is taller than Priya. Priya is taller than Sameer. Is Rahul taller than Sameer?', options: ['Yes', 'No', 'Cannot Say'] },
      { id: 'cog17', question: 'Which word is the odd one out: Happy, Sad, Angry, Excited, Sleepy?', options: ['Happy', 'Sad', 'Angry', 'Excited', 'Sleepy'] },
      { id: 'cog18', question: 'If 3 friends share 15 chocolates equally, how many chocolates does each friend get?', options: ['3', '5', '10', '15'] },
      { id: 'cog19', question: 'Which set of letters completes the pattern: AZ, BY, CX, DW, ?', options: ['EV', 'FU', 'GT', 'HS'] },
      { id: 'cog20', question: 'What is 25% of 80?', options: ['10', '20', '25', '40'] },
      { id: 'cog21', question: 'If \'CAT\' is coded as \'3120\', how would \'DOG\' be coded?', options: ['4157', '4158', '4159', '41510'] },
      { id: 'cog22', question: 'Choose the word that is most similar in meaning to \'Ancient\':', options: ['Modern', 'Old', 'New', 'Fast'] },
      { id: 'cog23', question: 'A square has a side length of 5 cm. What is its perimeter?', options: ['10 cm', '15 cm', '20 cm', '25 cm'] },
      { id: 'cog24', question: 'Which number completes the series: 10, 9, 7, 4, ?', options: ['0', '1', '2', '3'] },
      { id: 'cog25', question: 'If \'North\' is \'West\', then \'East\' is \'____\'?', options: ['North', 'South', 'East', 'West'] },
      { id: 'cog26', question: 'Find the odd one out: Lion, Tiger, Elephant, Wolf, Cheetah.', options: ['Lion', 'Tiger', 'Elephant', 'Wolf', 'Cheetah'] },
      { id: 'cog27', question: 'A class has 30 students. 2/3 of them are boys. How many girls are there?', options: ['10', '15', '20', '25'] },
      { id: 'cog28', question: 'Which letter comes next in the sequence: C, F, I, L, ?', options: ['M', 'N', 'O', 'P'] },
      { id: 'cog29', question: 'If yesterday was Monday, what day is tomorrow?', options: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
      { id: 'cog30', question: 'What is the value of 52−32?', options: ['4', '8', '16', '34'] },
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
      { id: 'sm11', question: 'I am good at managing my time effectively to meet deadlines.' },
      { id: 'sm12', question: 'I can work well under pressure and stay focused.' },
      { id: 'sm13', question: 'I am resourceful when faced with limited tools or information.' },
      { id: 'sm14', question: 'I am good at finding solutions to problems independently.' },
      { id: 'sm15', question: 'I can effectively manage multiple tasks at once.' },
      { id: 'sm16', question: 'I am comfortable learning and adapting to new technologies quickly.' },
      { id: 'sm17', question: 'I am good at analyzing information to make decisions.' },
      { id: 'sm18', question: 'I can clearly express my ideas in writing.' },
      { id: 'sm19', question: 'I am skilled at resolving conflicts or disagreements in a group.' },
      { id: 'sm20', question: 'I am comfortable taking initiative and leading a task.' },
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
  ]
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
               <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: career.swotAnalysis.replace(/\\n/g, '<br />') }}></div>
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

function Timer({ minutes, onTimeUp }: { minutes: number; onTimeUp: () => void }) {
  const [seconds, setSeconds] = React.useState(minutes * 60);

  React.useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const displayMinutes = Math.floor(seconds / 60);
  const displaySeconds = seconds % 60;

  return (
    <div className="flex items-center gap-2 font-mono text-lg font-semibold">
      <Clock className="h-5 w-5" />
      <span>{String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}</span>
    </div>
  );
}


function LikertScale({ id, question, labels, onChange, vertical = false }: { id: string; question: string; labels: {value: string; label: string}[], onChange: (value: string) => void, vertical?: boolean}) {
  const showLabels = labels.some(l => l.label);
  return (
    <div key={id} className="space-y-3">
      <p>{question}</p>
      <RadioGroup onValueChange={onChange} className="flex justify-between items-center">
        {showLabels && !vertical && <Label className="text-left w-1/5">{labels[0].label}</Label>}
        <div className={`flex ${vertical ? 'flex-col space-y-2' : 'flex-row justify-center items-center gap-4'}`}>
          {labels.map(l => (
            <div key={l.value} className="flex flex-col items-center gap-1">
              <RadioGroupItem value={l.value} id={`${id}-${l.value}`} />
              <Label htmlFor={`${id}-${l.value}`} className={`text-xs ${vertical ? 'text-left': ''}`}>{vertical ? l.label : l.value}</Label>
            </div>
          ))}
        </div>
        {showLabels && !vertical && <Label className="text-right w-1/5">{labels[labels.length-1].label}</Label>}
      </RadioGroup>
    </div>
  );
}

function MultipleChoice({ id, question, options, onChange }: { id: string; question: string; options: string[], onChange: (value: string) => void }) {
  return (
    <div key={id} className="space-y-3">
      <p>{question}</p>
      <RadioGroup onValueChange={onChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option, i) => (
          <div key={i} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${id}-${i}`} />
            <Label htmlFor={`${id}-${i}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    personality: '',
    interest: '',
    cognitiveAbilities: '',
    selfReportedSkills: '',
    cvq: '',
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<CareerSuggestion[] | null>(null);
  const { toast } = useToast();

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  
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
    setCurrentStep(0);
    setFormData({ personality: '', interest: '', cognitiveAbilities: '', selfReportedSkills: '', cvq: '' });
  }

  const renderStep = () => {
    if (currentStep > 0 && currentStep <= assessmentSections.length) {
      const sectionIndex = currentStep - 1;
      const section = assessmentSections[sectionIndex];
      let questions;
      switch(sectionIndex) {
        case 0: // Personality
          questions = assessmentQuestions.personality.map(q => 
             <LikertScale key={q.id} id={q.id} question={q.question} labels={ratingLabels['1-5']} onChange={(v) => handleValueChange('personality', formData.personality + ` ${q.id}:${v}`)} />
          );
          break;
        case 1: // Interest
          questions = assessmentQuestions.interest.map(q => 
             <LikertScale key={q.id} id={q.id} question={q.question} labels={ratingLabels['like-1-5']} onChange={(v) => handleValueChange('interest', formData.interest + ` ${q.id}:${v}`)} />
          );
          break;
        case 2: // Cognitive + Skill
          questions = (
            <div className="space-y-8">
              <div>
                <h4 className="font-bold text-lg mb-4">Part A: Cognitive Capability</h4>
                <div className="space-y-6">
                  {assessmentQuestions.cognitive.map((q, i) => 
                    <MultipleChoice key={q.id} id={q.id} question={`${i+1}. ${q.question}`} options={q.options} onChange={(v) => handleValueChange('cognitiveAbilities', formData.cognitiveAbilities + ` ${q.id}:${v}`)} />
                  )}
                </div>
              </div>
              <div className="border-t pt-8">
                 <h4 className="font-bold text-lg mb-4">Part B: Skill Mapping</h4>
                 <div className="space-y-6">
                  {assessmentQuestions.skillMapping.map((q, i) =>
                    <LikertScale key={q.id} id={q.id} question={`${i+31}. ${q.question}`} labels={ratingLabels['confidence-1-5']} onChange={(v) => handleValueChange('selfReportedSkills', formData.selfReportedSkills + ` ${q.id}:${v}`)} vertical={true} />
                  )}
                 </div>
              </div>
            </div>
          );
          break;
        case 3: // CVQ
          const cvqSections: {[key: string]: typeof assessmentQuestions.cvq} = {};
          assessmentQuestions.cvq.forEach(q => {
            if (!cvqSections[q.section]) cvqSections[q.section] = [];
            cvqSections[q.section].push(q);
          });
          questions = Object.entries(cvqSections).map(([sectionTitle, qs]) => (
            <div key={sectionTitle} className="space-y-6">
              <h4 className="font-bold text-lg">{sectionTitle}</h4>
              {qs.map(q =>
                <LikertScale key={q.id} id={q.id} question={q.question} labels={ratingLabels['1-5']} onChange={(v) => handleValueChange('cvq', formData.cvq + ` ${q.id}:${v}`)} />
              )}
            </div>
          ));
          break;
        default:
          return null;
      }
      return (
        <Card>
          <CardHeader className="flex-row justify-between items-center">
            <div>
              <CardTitle className="font-headline">{section.title}</CardTitle>
              <CardDescription>{section.instructions}</CardDescription>
            </div>
            <Timer minutes={section.time} onTimeUp={handleNext} />
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            {questions}
          </CardContent>
        </Card>
      );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Path-GeniX™ InsightX Assessment</CardTitle>
                <CardDescription>For students of 13-19 age group: Discover Your Unique Potential</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">General Instructions:</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                        <li>This assessment is designed to help you understand your unique personality, interests, and cognitive strengths. There are no right or wrong answers. Answer honestly based on how you truly feel or typically behave.</li>
                        <li>The assessment consists of 120 questions divided into 4 sections.</li>
                        <li>The total time allotted for the assessment is 90 minutes.</li>
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
                <Button onClick={handleNext} className="w-full" size="lg">Start Assessment</Button>
            </CardFooter>
        </Card>
    );
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="Path-GeniX Assessment" />
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
            {currentStep > 0 && (
                <div className="space-y-4">
                  <Progress value={(currentStep / (totalSteps-1)) * 100} className="w-full" />
                  <p className="text-center text-sm text-muted-foreground">Section {currentStep} of {totalSteps-1}</p>
                </div>
            )}
            
            {renderStep()}
            
            {currentStep > 0 && (
                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={handleBack} disabled={currentStep === 1}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    {currentStep < totalSteps -1 ? (
                        <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                            Next Section <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                            {isLoading ? <LoadingSpinner className="mr-2"/> : 'Get My Results'}
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

    