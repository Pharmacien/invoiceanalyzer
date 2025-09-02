'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type InvoiceUploadProps = {
  onFileUpload: (files: File[]) => void;
  isLoading: boolean;
};

export function InvoiceUpload({ onFileUpload, isLoading }: InvoiceUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setIsDragging(false);
      if (fileRejections.length > 0) {
        fileRejections.forEach(rejection => {
          rejection.errors.forEach((error: any) => {
            toast({
              variant: 'destructive',
              title: 'File Error',
              description: `${rejection.file.name}: ${error.message}`,
            });
          });
        });
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles);
      }
    },
    [onFileUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    multiple: true,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Upload Your Bills</CardTitle>
        <CardDescription>
          Drag & drop bill documents (PDF, JPG, PNG) here, or click to select files. Max 5MB each.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={cn(
            'flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors duration-200',
            isDragActive || isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
          )}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">Analyzing your bills...</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
              <p className="mt-4 text-sm font-medium text-foreground">
                Drag & drop or <span className="font-semibold text-primary">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG up to 5MB</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
