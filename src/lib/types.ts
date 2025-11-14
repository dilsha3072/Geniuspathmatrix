import type { CareerSuggestion as AiCareerSuggestion } from "@/ai/flows/ai-career-suggestions";

export type CareerSuggestion = AiCareerSuggestion;
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
