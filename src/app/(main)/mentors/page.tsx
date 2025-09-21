
'use client';

import * as React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, User, Bot, CornerDownLeft } from 'lucide-react';
import { getMentorResponse } from '@/lib/actions';
import { LoadingSpinner } from '@/components/loading-spinner';
import { cn } from '@/lib/utils';
import type { Message } from '@/ai/flows/mentor-flow';
import type { CareerSuggestion, GoalPlan } from '@/lib/types';


export default function MentorsPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I am your MentorSuite AI, a Socratic mirror designed to help you reflect on your career path. What's on your mind today?",
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [studentProfile, setStudentProfile] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Load data from localStorage and construct the profile string
    try {
      const storedResults = localStorage.getItem('assessmentResults');
      const storedGoals = localStorage.getItem('goalPlan');

      let profile = "Student's Path-GeniX Profile:\n\n";
      
      if (storedResults) {
        const results: CareerSuggestion[] = JSON.parse(storedResults);
        profile += "=== PathXplore Career Suggestions ===\n";
        results.slice(0, 3).forEach((career, index) => {
          profile += `${index + 1}. ${career.careerName} (Top Match: ${index === 0})\n`;
          profile += `   - Match Explanation: ${career.matchExplanation}\n`;
        });
        profile += "\n";
      }

      if (storedGoals) {
        const goals: GoalPlan = JSON.parse(storedGoals);
        profile += "=== GoalMint Plan ===\n";
        Object.entries(goals).forEach(([timeframe, goalList]) => {
          profile += `**${timeframe.replace('-', ' ')} Goals:**\n`;
          goalList.forEach(goal => {
            profile += `   - [${goal.category}] ${goal.title}\n`;
          });
        });
        profile += "\n";
      }
      setStudentProfile(profile);
    } catch (e) {
      console.error("Failed to load student data from localStorage", e);
      setStudentProfile("Could not load student profile data.");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const result = await getMentorResponse({ messages: newMessages, studentProfile });
    
    if (result.success && result.data) {
        const modelMessage: Message = { role: 'model', content: result.data };
        setMessages(prev => [...prev, modelMessage]);
    } else {
        const errorMessage: Message = { role: 'model', content: "I'm sorry, I encountered an error and couldn't process your message. Please try again." };
        setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AppHeader title="MentorSuite AI" />
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
              <CardHeader>
                  <CardTitle className="font-headline">Your Socratic Mirror</CardTitle>
                  <CardDescription>
                      Engage in a reflective conversation to explore your career and educational path.
                  </CardDescription>
              </CardHeader>
            <CardContent className="p-6 pt-0 flex-1 flex flex-col">
                <div className="flex-1 space-y-6 overflow-y-auto pr-4">
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
                            {message.role === 'model' && <Bot className="h-8 w-8 text-primary flex-shrink-0" />}
                            <div className={cn("max-w-lg rounded-xl p-4 text-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                {message.content}
                            </div>
                            {message.role === 'user' && <User className="h-8 w-8 text-muted-foreground flex-shrink-0" />}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                 {isLoading && (
                    <div className="flex items-center gap-4 p-4">
                        <Bot className="h-8 w-8 text-primary flex-shrink-0 animate-pulse" />
                        <div className="bg-muted p-4 rounded-xl">
                            <LoadingSpinner className="h-5 w-5" />
                        </div>
                    </div>
                )}
            </CardContent>
            <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="relative">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about your career path..."
                        className="pr-20 min-h-[52px] resize-none"
                        disabled={isLoading}
                    />
                    <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center gap-2">
                        <p className="text-xs text-muted-foreground hidden md:block">
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">Shift +</span><CornerDownLeft className="h-3 w-3" />
                            </kbd> for new line
                        </p>
                        <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                            <Send className="h-5 w-5" />
                            <span className="sr-only">Send Message</span>
                        </Button>
                    </div>
                </form>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
