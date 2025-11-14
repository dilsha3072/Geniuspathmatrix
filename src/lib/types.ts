
// import type { CareerSuggestion as AiCareerSuggestion } from "@/ai/flows/ai-career-suggestions";

// Using a placeholder type as the AI flow is removed
export type CareerSuggestion = {
    careerName: string;
    careerDescription: string;
    matchExplanation: string;
    swotAnalysis: string;
};

export type ReportInfo = {
    id: string;
    title: string;
    description: string;
    requiresAssessment: boolean;
    requiresGoalPlan: boolean;
    date: Date | null;
    isAvailable: boolean;
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
