'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type InvoiceUploadProps = {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
};

export function InvoiceUpload({ onFileUpload, isLoading }: InvoiceUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setIsDragging(false);
      if (fileRejections.length > 0) {
        toast({
          variant: 'destructive',
          title: 'File Error',
          description: fileRejections[0].errors[0].message,
        });
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    multiple: false,
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
        <CardTitle className="text-xl">Upload Your Bill</CardTitle>
        <CardDescription>
          Drag & drop a bill document (PDF, JPG, PNG) here, or click to select a file. Max 5MB.
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
              <p className="mt-4 text-sm font-medium text-muted-foreground">Analyzing your bill...</p>
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
