'use server';

import { suggestCareers, SuggestCareersInput } from '@/ai/flows/ai-career-suggestions';
import { getSwotAnalysis, SwotAnalysisInput } from '@/ai/flows/swot-analysis-for-career';
import { generateGoalsForCareer, GenerateGoalsInput } from '@/ai/flows/generate-goals-flow';

export async function getCareerSuggestions(input: SuggestCareersInput) {
  try {
    const suggestions = await suggestCareers(input);
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting career suggestions:', error);
    return { success: false, error: 'Failed to generate career suggestions.' };
  }
}

export async function generateSwotAnalysis(input: SwotAnalysisInput) {
  try {
    const analysis = await getSwotAnalysis(input);
    return { success: true, data: analysis };
  } catch (error) {
    console.error('Error generating SWOT analysis:', error);
    return { success: false, error: 'Failed to generate SWOT analysis.' };
  }
}

export async function getGeneratedGoals(input: GenerateGoalsInput) {
    try {
        const goals = await generateGoalsForCareer(input);
        return { success: true, data: goals };
    } catch (error) {
        console.error('Error generating goals:', error);
        return { success: false, error: 'Failed to generate goals.' };
    }
}
