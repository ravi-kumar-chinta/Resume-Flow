// src/ai/flows/resume-roast.ts
'use server';

/**
 * @fileOverview A resume roast AI agent that provides humorous critiques of a resume.
 *
 * - resumeRoast - A function that handles the resume roasting process.
 * - ResumeRoastInput - The input type for the resumeRoast function.
 * - ResumeRoastOutput - The return type for the resumeRoast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeRoastInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to roast.'),
});
export type ResumeRoastInput = z.infer<typeof ResumeRoastInputSchema>;

const ResumeRoastOutputSchema = z.object({
  roast: z.string().describe('A humorous critique of the resume, including emojis.'),
});
export type ResumeRoastOutput = z.infer<typeof ResumeRoastOutputSchema>;

export async function resumeRoast(input: ResumeRoastInput): Promise<ResumeRoastOutput> {
  return resumeRoastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeRoastPrompt',
  input: {schema: ResumeRoastInputSchema},
  output: {schema: ResumeRoastOutputSchema},
  prompt: `You are a professional resume critic with a great sense of humor. Your job is to roast the provided resume in a light-hearted and funny way, highlighting areas for improvement with witty remarks and playful jabs. Sprinkle in some relevant emojis to make the roast even more entertaining. Do not provide constructive criticism; focus only on roasting the resume.

Resume:
{{{resumeText}}}`,
});

const resumeRoastFlow = ai.defineFlow(
  {
    name: 'resumeRoastFlow',
    inputSchema: ResumeRoastInputSchema,
    outputSchema: ResumeRoastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
