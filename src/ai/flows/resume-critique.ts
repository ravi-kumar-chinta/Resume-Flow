'use server';

/**
 * @fileOverview Provides AI-powered line-by-line critique for a resume.
 *
 * - getResumeCritique - A function that accepts resume content and returns AI critique.
 * - ResumeCritiqueInput - The input type for the getResumeCritique function.
 * - ResumeCritiqueOutput - The return type for the getResumeCritique function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeCritiqueInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The complete text content of the resume.'),
});
export type ResumeCritiqueInput = z.infer<typeof ResumeCritiqueInputSchema>;

const ResumeCritiqueOutputSchema = z.object({
  critique: z.array(z.object({
    line: z.number().describe('The line number of the original resume text.'),
    originalText: z.string().describe('The original text from the resume.'),
    suggestion: z.string().describe('The AI-powered suggestion for improvement. If no suggestion, return an empty string.'),
  })).describe('An array of line-by-line critiques for the resume.'),
});
export type ResumeCritiqueOutput = z.infer<typeof ResumeCritiqueOutputSchema>;

export async function getResumeCritique(input: ResumeCritiqueInput): Promise<ResumeCritiqueOutput> {
  return resumeCritiqueFlow(input);
}

const resumeCritiquePrompt = ai.definePrompt({
  name: 'resumeCritiquePrompt',
  input: {schema: ResumeCritiqueInputSchema},
  output: {schema: ResumeCritiqueOutputSchema},
  prompt: `You are an AI resume expert. Provide a line-by-line critique of the resume provided.
For each line, provide the original text and a suggestion for improvement.
If a line does not need improvement, provide an empty string for the suggestion.
The resume text is provided below.

Resume Content:
{{{resumeContent}}}`,
});

const resumeCritiqueFlow = ai.defineFlow(
  {
    name: 'resumeCritiqueFlow',
    inputSchema: ResumeCritiqueInputSchema,
    outputSchema: ResumeCritiqueOutputSchema,
  },
  async input => {
    const {output} = await resumeCritiquePrompt(input);
    return output!;
  }
);
