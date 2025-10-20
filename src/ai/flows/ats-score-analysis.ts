'use server';

/**
 * @fileOverview An ATS (Applicant Tracking System) score analysis AI agent.
 *
 * - analyzeResumeAgainstATS - A function that handles the resume analysis process.
 * - ATSScoreAnalysisInput - The input type for the analyzeResumeAgainstATS function.
 * - ATSScoreAnalysisOutput - The return type for the analyzeResumeAgainstATS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ATSScoreAnalysisInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume.'),
  jobDescription: z.string().describe('The text content of the job description.'),
});
export type ATSScoreAnalysisInput = z.infer<typeof ATSScoreAnalysisInputSchema>;

const ATSScoreAnalysisOutputSchema = z.object({
  atsScore: z.number().describe('A score indicating how well the resume matches the job description (0-100).'),
  missingKeywords: z.array(z.string()).describe('A list of keywords from the job description that are missing in the resume.'),
  suggestions: z.string().describe('Suggestions on how to improve the resume to better match the job description.'),
});
export type ATSScoreAnalysisOutput = z.infer<typeof ATSScoreAnalysisOutputSchema>;

export async function analyzeResumeAgainstATS(input: ATSScoreAnalysisInput): Promise<ATSScoreAnalysisOutput> {
  return atsScoreAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsScoreAnalysisPrompt',
  input: {schema: ATSScoreAnalysisInputSchema},
  output: {schema: ATSScoreAnalysisOutputSchema},
  prompt: `You are an expert resume analyst, specializing in Applicant Tracking Systems (ATS).

You will analyze the provided resume against the job description to determine how well it matches ATS requirements.

Resume:
{{resumeText}}

Job Description:
{{jobDescription}}

Based on your analysis, provide the following:
1.  An ATS score (0-100) indicating how well the resume matches the job description. Consider keyword matching, skills alignment, and overall relevance.
2.  A list of keywords from the job description that are missing in the resume. Suggest specific keywords to include.
3.  Suggestions on how to improve the resume to better match the job description. Focus on content improvements, keyword optimization, and ATS compatibility.
`,
});

const atsScoreAnalysisFlow = ai.defineFlow(
  {
    name: 'atsScoreAnalysisFlow',
    inputSchema: ATSScoreAnalysisInputSchema,
    outputSchema: ATSScoreAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
