
export type CareerSuggestion = {
  careerName: string;
  careerDescription: string;
  swotAnalysis: string;
  matchExplanation: string;
};
export type SwotAnalysis = any;
export type GoalPlan = Record<string, Goal[]>;


export interface Goal {
  id: string;
  title: string;
  category: 'Academic' | 'Skill' | 'Networking';
  description: string;
}

export interface CareerPath {
    id: string;
    title:string;
    description: string;
    matchReasons: string[];
    avgSalary: string;
    jobOutlook: string;
    minEducation: string;
    responsibilities: string[];
    skillMatch: { skill: string; match: number }[];
}


// From assessment/page.tsx
export type AssessmentQuestion = { 
  id: string; 
  question: string; 
  options?: string[];
  section?: string;
};

export type AssessmentData = {
  personality: AssessmentQuestion[];
  interest: AssessmentQuestion[];
  cognitive: AssessmentQuestion[];
  skillMapping: AssessmentQuestion[];
  cvq: AssessmentQuestion[];
}

export type AssessmentSectionInfo = {
  id: string;
  title: string;
  questions: number;
  time: number;
  instructions: string;
};

// From reports/page.tsx
export type ReportInfo = {
  id: string;
  title: string;
  description: string;
  requiresAssessment: boolean;
  requiresGoalPlan?: boolean;
  date: Date | null;
  isAvailable: boolean;
}
