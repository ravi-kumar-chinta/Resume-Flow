'use server';

/**
 * @fileOverview An ATS (Applicant Tracking System) readability score analysis AI agent.
 *
 * - analyzeResumeReadability - A function that handles the resume readability analysis process.
 * - ATSReadabilityInput - The input type for the analyzeResumeReadability function.
 * - ATSReadabilityOutput - The return type for the analyzeResumeReadability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ATSReadabilityInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
});
export type ATSReadabilityInput = z.infer<typeof ATSReadabilityInputSchema>;

const ATSReadabilityOutputSchema = z.object({
  readabilityScore: z.number().describe('A score indicating how easily an ATS can parse the resume (0-100).'),
  suggestions: z.string().describe('Suggestions on how to improve the resume for better ATS readability.'),
});
export type ATSReadabilityOutput = z.infer<typeof ATSReadabilityOutputSchema>;

export async function analyzeResumeReadability(input: ATSReadabilityInput): Promise<ATSReadabilityOutput> {
  return atsReadabilityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsReadabilityScorePrompt',
  input: {schema: ATSReadabilityInputSchema},
  output: {schema: ATSReadabilityOutputSchema},
  prompt: `You are an expert resume analyst, specializing in Applicant Tracking Systems (ATS).

You will analyze the provided resume to determine how easily it can be parsed by an ATS.

Resume:
{{resumeText}}

Based on your analysis, provide the following:
1.  An ATS readability score (0-100) indicating how well-structured and parsable the resume is. Consider factors like clear section headings (e.g., "Experience", "Education", "Skills"), standard font usage, absence of complex tables or graphics, and clear contact information.
2.  Actionable suggestions on how to improve the resume's format and content for better readability by automated systems.
`,
});

const atsReadabilityScoreFlow = ai.defineFlow(
  {
    name: 'atsReadabilityScoreFlow',
    inputSchema: ATSReadabilityInputSchema,
    outputSchema: ATSReadabilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
