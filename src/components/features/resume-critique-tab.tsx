
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getResumeCritique, type ResumeCritiqueOutput } from '@/ai/flows/resume-critique';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, MessageSquareQuote, Sparkles } from 'lucide-react';
import type * as PdfJs from 'pdfjs-dist';

interface ResumeCritiqueTabProps {
  resumeText: string;
  pdfFile: File | null;
}

export function ResumeCritiqueTab({ resumeText, pdfFile }: ResumeCritiqueTabProps) {
  const [critique, setCritique] = useState<ResumeCritiqueOutput['critique'] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const pdfjsRef = useRef<typeof PdfJs | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    import('pdfjs-dist/build/pdf').then(pdfjs => {
      pdfjsRef.current = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  const renderPdf = async (file: File) => {
    if (!pdfjsRef.current || !canvasRef.current) return;

    const pdfjs = pdfjsRef.current;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedArray).promise;
        const page = await pdf.getPage(1); // Render first page
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      } catch (pdfError) {
        console.error('Error rendering PDF:', pdfError);
        toast({ title: 'Error', description: 'Could not render the PDF file.', variant: 'destructive' });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (pdfFile) {
      renderPdf(pdfFile);
    }
  }, [pdfFile]);

  const handleGetCritique = async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Resume is empty',
        description: 'Please paste or upload your resume before getting a critique.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setCritique(null);
    try {
      const result = await getResumeCritique({ resumeContent: resumeText });
      setCritique(result.critique);
    } catch (error) {
      console.error('Error getting resume critique:', error);
      toast({
        title: 'An error occurred',
        description: 'Failed to get resume critique. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasSuggestions = critique?.some(c => c.suggestion);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Resume Critique</CardTitle>
        <CardDescription>
          Get line-by-line feedback on your resume. The AI will provide suggestions to improve your resume's content and structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleGetCritique} disabled={isLoading || !resumeText}>
          <MessageSquareQuote className="mr-2 h-4 w-4" />
          {isLoading ? 'Analyzing...' : 'Critique My Resume'}
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          <div>
              <h3 className="text-lg font-semibold mb-2">Resume Preview</h3>
              {pdfFile ? (
                  <div className="border rounded-lg overflow-auto max-h-[700px]">
                      <canvas ref={canvasRef}></canvas>
                  </div>
              ) : (
                  <pre className="p-4 border rounded-lg bg-muted whitespace-pre-wrap font-sans text-sm max-h-[700px] overflow-auto">
                      {resumeText || "Upload a PDF or paste resume text to see a preview."}
                  </pre>
              )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">AI Feedback</h3>
            <div className="border rounded-lg p-4 bg-background max-h-[700px] overflow-auto">
              {isLoading && (
                  <div className="space-y-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                  </div>
              )}
              {critique && (
                <div>
                    {!hasSuggestions && !isLoading ? (
                        <div className="text-center py-10">
                            <Sparkles className="mx-auto h-12 w-12 text-green-500" />
                            <h4 className="mt-4 text-lg font-semibold">Great job!</h4>
                            <p className="text-muted-foreground mt-2">The AI found no critical issues to suggest.</p>
                        </div>
                    ) : (
                    <ul className="space-y-4">
                        {critique.map((item, index) => item.suggestion ? (
                            <li key={index}>
                                <Alert>
                                    <Lightbulb className="h-4 w-4" />
                                    <AlertTitle>Suggestion for: "{item.originalText}"</AlertTitle>
                                    <AlertDescription>
                                        {item.suggestion}
                                    </AlertDescription>
                                </Alert>
                            </li>
                        ): null)}
                    </ul>
                    )}
                </div>
              )}
              {!critique && !isLoading && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Click "Critique My Resume" to see AI feedback here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
