import { openai } from '@ai-sdk/openai'

// AI configuration and utilities for Syncly
export const aiConfig = {
  model: openai('gpt-4o'),
  maxTokens: 1000,
}

// Prompt templates for AI features
export const prompts = {
  meetingSummary: (notes: string) => `
    Summarize the following 1:1 meeting notes into key points and action items:
    
    ${notes}
    
    Please provide:
    1. A brief summary (2-3 sentences)
    2. Key discussion points
    3. Action items with owners
  `,
  
  suggestTopics: (developerContext: string) => `
    Based on the following context about a developer, suggest 5 discussion topics for their next 1:1 meeting:
    
    ${developerContext}
    
    Focus on career growth, project progress, and team dynamics.
  `,
  
  generateFollowUp: (previousMeeting: string) => `
    Based on the following previous meeting notes, generate follow-up questions for the next 1:1:
    
    ${previousMeeting}
    
    Focus on progress on action items and any blockers mentioned.
  `,
}
