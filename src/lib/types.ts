
import type { SwotAnalysisOutput, SuggestCareersOutput } from "@/ai/flows/ai-career-suggestions";

export type CareerSuggestion = SuggestCareersOutput[0];
export type SwotAnalysis = SwotAnalysisOutput;

export interface Goal {
  id: string;
  title: string;
  category: 'Academic' | 'Skill' | 'Networking';
  completed: boolean;
  dueDate: Date;
}

export interface Mentor {
  id: string;
  name: string;
  title:string;
  specialties: string[];
  imageId: string;
}

export interface CareerPath {
    id: string;
    title: string;
    description: string;
    matchReasons: string[];
    avgSalary: string;
    jobOutlook: string;
    minEducation: string;
    responsibilities: string[];
    skillMatch: { skill: string; match: number }[];
}
