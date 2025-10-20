
'use client';

import { useState, useRef, type ChangeEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Flame, ScanLine, Upload, FileText, FileCheck, MessageSquareQuote, Newspaper } from 'lucide-react';
import { AtsScoreTab } from '@/components/features/ats-score-tab';
import { RoastTab } from '@/components/features/roast-tab';
import { AtsReadabilityTab } from '@/components/features/ats-readability-tab';
import { toast } from '@/hooks/use-toast';
import type * as PdfJs from 'pdfjs-dist';
import { ResumeCritiqueTab } from './features/resume-critique-tab';
import { CoverLetterTab } from './features/cover-letter-tab';

export function MainPage() {
  const [resumeText, setResumeText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfjsRef = useRef<typeof PdfJs | null>(null);

  useEffect(() => {
    import('pdfjs-dist').then(pdfjs => {
      pdfjsRef.current = pdfjs;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && pdfjsRef.current) {
      setPdfFile(file);
      const pdfjs = pdfjsRef.current;
      try {
        if (file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = async (e) => {
            try {
              const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
              const pdf = await pdfjs.getDocument(typedArray).promise;
              let text = '';
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                text += textContent.items.map(item => (item as any).str).join(' ');
              }
              setResumeText(text);
              toast({ title: 'Success', description: 'PDF parsed successfully.' });
            } catch (pdfError) {
              console.error('Error parsing PDF:', pdfError);
              toast({ title: 'Error', description: 'Could not parse the PDF file.', variant: 'destructive' });
            }
          };
          reader.readAsArrayBuffer(file);
        } else {
          setPdfFile(null);
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result as string;
            setResumeText(text);
          };
          reader.readAsText(file);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast({ title: 'Error', description: 'Failed to process the file.', variant: 'destructive' });
      }
    }
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">ResumeFlow</h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="mx-auto grid max-w-6xl gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Elevate Your Resume with AI-Powered Insights
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
             Optimize your resume, get AI insights, and stand out to recruiters
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Resume</CardTitle>
              <CardDescription>
              Paste your resume content or upload a .txt or .pdf file to see AI-powered suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Textarea
                  placeholder="Paste your resume here..."
                  className="min-h-[300px] resize-y text-sm"
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    setPdfFile(null);
                  }}
                />
                <div className="flex justify-end">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".txt,.pdf"
                  />
                  <Button onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="critique" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
              <TabsTrigger value="critique">
                <MessageSquareQuote className="mr-2 h-4 w-4" /> Critique
              </TabsTrigger>
              <TabsTrigger value="cover-letter">
                <Newspaper className="mr-2 h-4 w-4" /> Cover Letter
              </TabsTrigger>
               <TabsTrigger value="readability">
                <FileCheck className="mr-2 h-4 w-4" /> Readability
              </TabsTrigger>
              <TabsTrigger value="ats">
                <ScanLine className="mr-2 h-4 w-4" /> ATS Score
              </TabsTrigger>
              <TabsTrigger value="roast">
                <Flame className="mr-2 h-4 w-4" /> Roast
              </TabsTrigger>
            </TabsList>
            <TabsContent value="critique" className="mt-6">
              <ResumeCritiqueTab resumeText={resumeText} pdfFile={pdfFile} />
            </TabsContent>
            <TabsContent value="cover-letter" className="mt-6">
                <CoverLetterTab resumeText={resumeText} />
            </TabsContent>
            <TabsContent value="readability" className="mt-6">
              <AtsReadabilityTab resumeText={resumeText} />
            </TabsContent>
            <TabsContent value="ats" className="mt-6">
              <AtsScoreTab resumeText={resumeText} />
            </TabsContent>
            <TabsContent value="roast" className="mt-6">
              <RoastTab resumeText={resumeText} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="mt-auto border-t py-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by ResumeFlow — Smart AI for Smarter Resumes
© Ravi Kumar Ch | 2025</p>
        </div>
      </footer>
    </div>
  );
}
