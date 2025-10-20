
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { analyzeResumeAgainstATS, type ATSScoreAnalysisOutput } from '@/ai/flows/ats-score-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface AtsScoreTabProps {
  resumeText: string;
}

export function AtsScoreTab({ resumeText }: AtsScoreTabProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ATSScoreAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
       toast({
        title: 'Resume is empty',
        description: 'Please provide your resume before analyzing.',
        variant: 'destructive',
      });
      return;
    }
    if(!jobDescription.trim()) {
      toast({
        title: 'Job description is empty',
        description: 'Please provide the job description to analyze against.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeResumeAgainstATS({ resumeText, jobDescription });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing ATS score:', error);
      toast({
        title: 'An error occurred',
        description: 'Failed to analyze the resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Score Analysis</CardTitle>
        <CardDescription>
        Paste a job description to see how well your resume aligns. The AI evaluates keyword relevance, highlights missing skills, and gives actionable tips to boost your match score.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="job-description" className="font-medium">Job Description</label>
          <Textarea
            id="job-description"
            placeholder="Paste the job description here..."
            className="min-h-[200px] resize-y"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <Button onClick={handleAnalyze} disabled={isLoading || !resumeText || !jobDescription}>
          {isLoading ? 'Analyzing...' : 'Analyze ATS Score'}
        </Button>

        {isLoading && (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {analysis && (
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-xl font-semibold">ATS Match Score: {analysis.atsScore}%</h3>
              <Progress value={analysis.atsScore} className="mt-2 h-4" />
              <p className="mt-2 text-sm text-muted-foreground">This score estimates how well your resume might perform in an Applicant Tracking System.</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Missing Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary">{keyword}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No critical keywords seem to be missing. Great job!</p>
                )}
              </CardContent>
            </Card>

            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Smart Resume Suggestions</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap font-sans">{analysis.suggestions}</pre>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
