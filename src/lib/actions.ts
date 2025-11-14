
'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import type { GoalPlan, CareerSuggestion } from './types';
import { FieldValue } from 'firebase-admin/firestore';
// import { suggestCareers } from '@/ai/flows/ai-career-suggestions';
// import { generateGoals } from '@/ai/flows/generate-goals-flow';
// import { getSocraticResponse } from '@/ai/flows/mentor-flow';


type GeneralInfo = {
    dob: string;
    gender: string;
    classOfStudy: string;
    place: string;
    schoolOrCollege: string;
};

type SuggestCareersInput = {
    personality: string;
    interest: string;
    cognitiveAbilities: string;
    selfReportedSkills: string;
    cvq: string;
}

type GenerateGoalsInput = {
    careerName: string;
    studentProfile: string;
    timeframes: string[];
}

type MentorInput = {
    messages: { role: 'user' | 'model', content: string }[];
    studentProfile: string;
}


export async function createUserDocument(user: { uid: string; email: string | null }) {
    try {
        const userDocRef = adminDb.collection("users").doc(user.uid);
        await userDocRef.set({
            uid: user.uid,
            email: user.email,
            createdAt: FieldValue.serverTimestamp(),
        });
        return { success: true };
    } catch (error) {
        console.error('Error creating user document:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user document.';
        return { success: false, error: errorMessage };
    }
}


export async function getCareerSuggestions(input: SuggestCareersInput & { userId: string, generalInfo: GeneralInfo }) {
  try {
    const userId = input.userId;
    if (!userId) throw new Error("User not authenticated.");

    // MOCK: Return mock career suggestions
    const suggestions: CareerSuggestion[] = [
        {
            careerName: "Software Engineer",
            careerDescription: "Designs, develops, and maintains software applications. It's a field with high demand and diverse opportunities.",
            matchExplanation: "Your strong logical reasoning and interest in building things make this a great fit. Your personality suggests you enjoy complex problem-solving.",
            swotAnalysis: `**Strengths:**
- High problem-solving skills.
- Interest in technology.

**Weaknesses:**
- Limited experience with large-scale projects.

**Opportunities:**
- High demand for software engineers.
- Many free online resources to learn.

**Threats:**
- Fast-paced industry requires constant learning.
- AI code generation tools might change the landscape.`
        },
        {
            careerName: "Graphic Designer",
            careerDescription: "Creates visual concepts to communicate ideas that inspire, inform, or captivate consumers. They work with both text and images.",
            matchExplanation: "Your artistic interests and creative personality are a perfect match for this career. Your attention to detail is also a great asset.",
            swotAnalysis: `**Strengths:**
- High creativity and artistic interest.
- Good attention to detail.

**Weaknesses:**
- May need to build a stronger portfolio.

**Opportunities:**
- Freelance opportunities are abundant.
- Growing need for digital design skills.

**Threats:**
- Competitive field.
- AI image generation tools.`
        },
    ];
    
    // 2. Save assessment data and suggestions to the user's document
    const userDocRef = adminDb.collection("users").doc(userId);
    await userDocRef.set({
        assessment: {
            ...input,
            updatedAt: FieldValue.serverTimestamp(),
        },
        careerSuggestions: suggestions,
    }, { merge: true });

    // 3. Generate and save the summary report
    const reportDocRef = adminDb.collection("reports").doc(userId);
    const reportData = {
        userId: userId,
        assessmentSummary: {
            personality: input.personality?.substring(0, 100) + '...', // Store a summary
            interest: input.interest?.substring(0, 100) + '...',
            cognitiveAbilities: input.cognitiveAbilities?.substring(0, 100) + '...',
            cvq: input.cvq?.substring(0, 100) + '...',
        },
        generatedAt: FieldValue.serverTimestamp(),
    };
    await reportDocRef.set(reportData, { merge: true });
    
    return { success: true, data: suggestions };
  } catch (error) {
    console.error('Error getting career suggestions:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate career suggestions.';
    return { success: false, error: errorMessage };
  }
}

export async function getGeneratedGoals(input: GenerateGoalsInput & { userId: string }) {
    try {
        const userId = input.userId;
        if (!userId) throw new Error("User not authenticated.");

        // MOCK: Return mock goals
        const goals: GoalPlan = {
            '1-year': [
                { id: 'acad-1', title: 'Complete an online Python course', category: 'Academic', description: 'Finish a comprehensive Python for beginners course on Coursera or Udemy within 6 months.' },
                { id: 'skill-1', title: 'Build a personal portfolio website', category: 'Skill', description: 'Create and deploy a simple website to showcase your projects using HTML, CSS, and basic JavaScript.' }
            ],
            '3-year': [
                { id: 'acad-2', title: 'Achieve a relevant certification', category: 'Academic', description: 'Obtain a certification like AWS Certified Cloud Practitioner to demonstrate foundational cloud knowledge.' },
                { id: 'net-1', title: 'Attend 3 industry meetups', category: 'Networking', description: 'Find and attend local or virtual meetups related to your chosen career path.' }
            ]
        };
        
        const userDocRef = adminDb.collection("users").doc(userId);
        await userDocRef.update({
            goalPlan: goals,
            'careerSuggestions.0.selected': true, // Mark the first career as selected for goal planning
        });

        return { success: true, data: goals };
    } catch (error)
 {
        console.error('Error generating goals:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate goals.';
        return { success: false, error: errorMessage };
    }
}

export async function sendParentQuiz(data: { email?: string, phone?: string, studentId: string }) {
  console.log('Simulating sending parent quiz for student:', data.studentId);
  if (!data.email && !data.phone) {
    return { success: false, error: 'No contact information provided.' };
  }
  // In a real app, you would use a unique token for the student.
  const quizLink = `/parent-quiz?studentId=${data.studentId}`; 
  console.log(`(Pretend) Sending link ${quizLink} to parent with contact:`, { email: data.email, phone: data.phone });
  
  return { success: true, message: 'Parent quiz has been sent successfully!' };
}

export async function saveParentQuizAnswers(data: { studentId: string, answers: Record<string, string> }) {
    try {
        const { studentId, answers } = data;
        if (!studentId || !answers) {
            throw new Error('Missing student ID or answers for parent quiz.');
        }

        const answersCollectionRef = adminDb.collection('parentAnswers');
        await answersCollectionRef.add({
            studentId,
            answers,
            submittedAt: FieldValue.serverTimestamp(),
        });
        
        return { success: true, message: 'Answers saved successfully.' };
    } catch (error) {
        console.error('Error saving parent quiz answers:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save parent quiz answers.';
        return { success: false, error: errorMessage };
    }
}


export async function getMentorResponse(input: MentorInput & { userId: string }) {
  try {
    const userId = input.userId;
    if (!userId) throw new Error("User not authenticated.");
    
    // MOCK: Return a mock Socratic response
    const response = "That's an interesting thought. Can you tell me more about what led you to that conclusion?";
    
    const userDocRef = adminDb.collection("users").doc(userId);
    const userMessage = input.messages[input.messages.length - 1];

    // Check if the chat history exists, if not, create it before updating
    const userDoc = await userDocRef.get();
    if (!userDoc.exists() || !userDoc.data()?.mentorChat) {
         await userDocRef.set({ mentorChat: [] }, { merge: true });
    }
    
    // Atomically add both the user's message and the model's response
    await userDocRef.update({
        mentorChat: FieldValue.arrayUnion(userMessage, { role: 'model', content: response })
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
        const userDocRef = adminDb.collection("users").doc(userId);
        const docSnap = await userDocRef.get();

        if (docSnap.exists) {
            // Firestore admin SDK returns Timestamps, which are not directly serializable
            // for client components. We need to convert them.
            const data = docSnap.data();
            if (data) {
                // A simple and safe way to convert all timestamps in a nested object
                const serializableData = JSON.parse(JSON.stringify(data, (key, value) => {
                    if (value && value.toDate) { // Check if it's a Firestore Timestamp
                        return value.toDate().toISOString();
                    }
                    return value;
                }));
                return { success: true, data: serializableData };
            }
             return { success: true, data: null };
        } else {
            return { success: true, data: null };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user data.';
        return { success: false, error: errorMessage };
    }
}

export async function getAppData(docId: string) {
    try {
        const appDataRef = adminDb.collection("app_data").doc(docId);
        const docSnap = await appDataRef.get();

        if (docSnap.exists) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: `Document ${docId} not found.` };
        }
    } catch (error) {
        console.error('Error fetching app data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch app data.';
        return { success: false, error: errorMessage };
    }
}
