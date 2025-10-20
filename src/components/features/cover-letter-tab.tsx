
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateCoverLetter, type CoverLetterOutput } from '@/ai/flows/cover-letter';
import { Newspaper, ClipboardCopy } from 'lucide-react';

interface CoverLetterTabProps {
  resumeText: string;
}

export function CoverLetterTab({ resumeText }: CoverLetterTabProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState<CoverLetterOutput['coverLetter'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Resume is empty',
        description: 'Please provide your resume before generating a cover letter.',
        variant: 'destructive',
      });
      return;
    }
    if (!jobDescription.trim()) {
      toast({
        title: 'Job description is empty',
        description: 'Please provide the job description to generate a cover letter.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setCoverLetter(null);
    try {
      const result = await generateCoverLetter({ resumeText, jobDescription });
      setCoverLetter(result.coverLetter);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: 'An error occurred',
        description: 'Failed to generate the cover letter. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = () => {
    if (coverLetter) {
        navigator.clipboard.writeText(coverLetter);
        toast({
            title: 'Copied to clipboard!',
            description: 'The cover letter has been copied to your clipboard.',
        });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Cover Letter Generator</CardTitle>
        <CardDescription>
          Provide a job description, and our AI will generate a tailored cover letter based on your resume.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="job-description-cover-letter" className="font-medium">Job Description</label>
          <Textarea
            id="job-description-cover-letter"
            placeholder="Paste the job description here..."
            className="min-h-[200px] resize-y"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <Button onClick={handleGenerate} disabled={isLoading || !resumeText || !jobDescription}>
          <Newspaper className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Cover Letter'}
        </Button>

        {(isLoading || coverLetter) && (
            <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold">Generated Cover Letter</h3>
                <Card>
                    <CardContent className="p-6">
                        {isLoading ? (
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-full mt-4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                             </div>
                        ): (
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-7 w-7"
                                    onClick={handleCopy}
                                    disabled={!coverLetter}
                                >
                                    <ClipboardCopy className="h-4 w-4" />
                                </Button>
                                <pre className="whitespace-pre-wrap font-sans text-sm">{coverLetter}</pre>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}
        
      </CardContent>
    </Card>
  );
}
