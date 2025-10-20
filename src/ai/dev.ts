import { config } from 'dotenv';
config();

import '@/ai/flows/resume-suggestion.ts';
import '@/ai/flows/resume-roast.ts';
import '@/ai/flows/ats-score-analysis.ts';
import '@/ai/flows/ats-readability-score.ts';
import '@/ai/flows/resume-critique.ts';
import '@/ai/flows/cover-letter.ts';
