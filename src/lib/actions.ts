'use server';

import { suggestCareers, SuggestCareersInput } from '@/ai/flows/ai-career-suggestions';
import { getSwotAnalysis, SwotAnalysisInput } from '@/ai/flows/swot-analysis-for-career';

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
