
'use server';

import { adminDb } from '@/lib/firebase/firebase-admin';
import type { GoalPlan, CareerSuggestion } from './types';
import { FieldValue } from 'firebase-admin/firestore';

// Mock types as AI flows are removed
type SuggestCareersInput = any;
type GenerateGoalsInput = any;
type MentorInput = any;


type GeneralInfo = {
    dob: string;
    gender: string;
    classOfStudy: string;
    place: string;
    schoolOrCollege: string;
};


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

    // 1. Get career suggestions from the AI
    // const suggestions = await suggestCareers(input);
    const suggestions: CareerSuggestion[] = [
        {
            careerName: "Software Engineer",
            careerDescription: "Software engineers design, develop, and maintain software systems. They use their programming skills to create everything from mobile apps to large-scale enterprise systems.",
            matchExplanation: "Your strong logical reasoning skills and interest in building things make you a great fit for software engineering. Your personality suggests you enjoy solving complex problems.",
            swotAnalysis: `**Strengths:**
- Strong analytical and problem-solving skills.
- High demand for this profession.

**Weaknesses:**
- Requires continuous learning to keep up with new technologies.

**Opportunities:**
- Can work in various industries.
- Remote work possibilities.

**Threats:**
- Competition is high for entry-level positions.`
        },
        {
            careerName: "Graphic Designer",
            careerDescription: "Graphic designers create visual concepts, using computer software or by hand, to communicate ideas that inspire, inform, and captivate consumers.",
            matchExplanation: "Your 'Artistic' interest and 'Openness' on your personality test indicate a strong creative side, which is perfect for graphic design.",
            swotAnalysis: ""
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

        // const goals = await generateGoals(input);
        const goals: GoalPlan = {
            "1-year": [
                { id: 'acad-1', title: 'Complete an online course in Python', category: 'Academic', description: 'Finish a Python for Beginners course on Coursera or edX within 6 months.'},
                { id: 'skill-1', title: 'Build a personal portfolio website', category: 'Skill', description: 'Create and deploy a simple website to showcase your projects.'},
                { id: 'net-1', title: 'Attend a local tech meetup', category: 'Networking', description: 'Find and attend at least one tech meetup in your area.'}
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
    
    // const response = await getSocraticResponse(input);
    const response = "That's a great question. What part of that feels most important to you right now?";
    
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
