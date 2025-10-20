
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { resumeRoast, type ResumeRoastOutput } from '@/ai/flows/resume-roast';
import { Flame } from 'lucide-react';

interface RoastTabProps {
  resumeText: string;
}

export function RoastTab({ resumeText }: RoastTabProps) {
  const [roast, setRoast] = useState<ResumeRoastOutput['roast'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRoast = async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Resume is empty',
        description: 'Can\'t roast what isn\'t there! Paste your resume first.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setRoast(null);
    try {
      const result = await resumeRoast({ resumeText });
      setRoast(result.roast);
    } catch (error) {
      console.error('Error roasting resume:', error);
      toast({
        title: 'The AI is speechless...',
        description: 'It seems we failed to roast your resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Roast</CardTitle>
        <CardDescription>
          Ready for some fun? Our AI will give your resume a light-hearted roast. Don't worry, it's all in good fun!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleRoast} disabled={isLoading} variant="destructive">
          <Flame className="mr-2 h-4 w-4" />
          {isLoading ? 'Heating up the grill...' : 'Roast My Resume'}
        </Button>

        {isLoading && (
          <div className="space-y-2 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        )}

        {roast && (
          <div className="pt-4">
            <Card className="bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Flame />
                  The Roast is Served!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-orange-900 dark:text-orange-200 italic leading-relaxed whitespace-pre-wrap">{roast}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
