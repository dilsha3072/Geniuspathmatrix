'use server';

import { suggestCareers, SuggestCareersInput } from '@/ai/flows/ai-career-suggestions';
import { getSwotAnalysis, SwotAnalysisInput } from '@/ai/flows/swot-analysis-for-career';
import { generateGoalsForCareer, GenerateGoalsInput } from '@/ai/flows/generate-goals-flow';
import { getSocraticResponse, MentorInput, Message } from '@/ai/flows/mentor-flow';
import { db } from '@/lib/firebase-admin'; // Using admin SDK on the server
import { doc, getDoc, updateDoc, arrayUnion, setDoc, Timestamp } from 'firebase/firestore';


export async function getCareerSuggestions(input: SuggestCareersInput & { userId: string }) {
  try {
    const userId = input.userId;
    if (!userId) throw new Error("User not authenticated.");

    const suggestions = await suggestCareers(input);
    
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
        assessment: {
            ...input,
            updatedAt: Timestamp.now(),
        },
        careerSuggestions: suggestions,
    });
    
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting career suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate career suggestions.';
    return { success: false, error: errorMessage };
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

export async function getGeneratedGoals(input: GenerateGoalsInput & { userId: string }) {
    try {
        const userId = input.userId;
        if (!userId) throw new Error("User not authenticated.");

        const goals = await generateGoalsForCareer(input);
        
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, {
            goalPlan: goals,
        });

        return { success: true, data: goals };
    } catch (error)
 {
        console.error('Error generating goals:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate goals.';
        return { success: false, error: errorMessage };
    }
}

export async function sendParentQuiz(parentContact: { email?: string, phone?: string }) {
  // In a real app, you would generate a unique, secure link to the /parent-quiz page
  // and use a service like Twilio or SendGrid to send it.
  console.log('Simulating sending parent quiz to:', parentContact);
  if (!parentContact.email && !parentContact.phone) {
    return { success: false, error: 'No contact information provided.' };
  }
  const quizLink = '/parent-quiz?uid=<some-unique-token-identifying-student>'; 
  console.log(`(Pretend) Sending link ${quizLink} to parent.`);
  
  // Simulate success
  return { success: true, message: 'Parent quiz sent successfully!' };
}

export async function getMentorResponse(input: MentorInput & { userId: string }) {
  try {
    const userId = input.userId;
    if (!userId) throw new Error("User not authenticated.");
    
    const response = await getSocraticResponse(input);
    
    const userDocRef = doc(db, "users", userId);
    const userMessage = input.messages[input.messages.length - 1];

    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists() || !userDoc.data()?.mentorChat) {
         await setDoc(userDocRef, { mentorChat: [] }, { merge: true });
    }
    
    await updateDoc(userDocRef, {
        mentorChat: arrayUnion(userMessage, { role: 'model', content: response })
    });
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Error getting mentor response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to get mentor response.';
    return { success: false, error: errorMessage };
  }
}

export async function getUserData(userId: string) {
    try {
        if (!userId) {
            return { success: false, error: "User not authenticated." };
        }
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: true, data: null };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data.';
        return { success: false, error: errorMessage };
    }
}
