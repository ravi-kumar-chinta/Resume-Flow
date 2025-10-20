
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { analyzeResumeReadability, type ATSReadabilityOutput } from '@/ai/flows/ats-readability-score';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileCheck, Terminal } from 'lucide-react';

interface AtsReadabilityTabProps {
  resumeText: string;
}

export function AtsReadabilityTab({ resumeText }: AtsReadabilityTabProps) {
  const [analysis, setAnalysis] = useState<ATSReadabilityOutput | null>(null);
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
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await analyzeResumeReadability({ resumeText });
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing ATS readability:', error);
      toast({
        title: 'An error occurred',
        description: 'Failed to analyze the resume readability. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Clear analysis when resume text changes
    setAnalysis(null);
  }, [resumeText]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>ATS Score Analysis</CardTitle>
        <CardDescription>
          Understand how applicant tracking systems (ATS) interpret your resume. Get actionable AI insights to improve readability and formatting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleAnalyze} disabled={isLoading || !resumeText}>
          <FileCheck className="mr-2 h-4 w-4" />
          {isLoading ? 'Analyzing Readability...' : 'Analyze Readability'}
        </Button>

        {isLoading && (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        )}

        {analysis && (
          <div className="space-y-6 pt-4">
            <div>
              <h3 className="text-xl font-semibold">ATS Readability Score: {analysis.readabilityScore}%</h3>
              <Progress value={analysis.readabilityScore} className="mt-2 h-4" />
              <p className="mt-2 text-sm text-muted-foreground">This score estimates how well an automated system can read and understand your resume.</p>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-800 dark:text-blue-300">AI Suggestions</AlertTitle>
              <AlertDescription className="text-blue-900 dark:text-blue-200 prose prose-sm dark:prose-invert">
                <pre className="whitespace-pre-wrap font-sans">{analysis.suggestions}</pre>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
