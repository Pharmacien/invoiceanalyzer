'use client';

import { useEffect, useState } from 'react';
import type { Invoice } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Download, Printer } from 'lucide-react';

type InvoicePreviewDialogProps = {
  invoice: Invoice | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InvoicePreviewDialog({
  invoice,
  isOpen,
  onOpenChange,
}: InvoicePreviewDialogProps) {
  const [fileUrl, setFileUrl] = useState('');

  useEffect(() => {
    if (invoice?.file) {
      const url = URL.createObjectURL(invoice.file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [invoice]);

  const handleDownload = () => {
    if (!fileUrl || !invoice) return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = invoice.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    if (!fileUrl || !invoice) return;
    const printWindow = window.open(fileUrl);
    printWindow?.addEventListener('load', () => {
      printWindow.print();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice Preview: {invoice?.file.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {invoice?.privacyAssessment?.hasPrivacyConcerns && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Privacy Warning</AlertTitle>
              <AlertDescription>
                {invoice.privacyAssessment.privacyConcernsDetails}
              </AlertDescription>
            </Alert>
          )}
          <div className="h-[60vh] rounded-md border bg-secondary">
            {fileUrl ? (
              <embed src={fileUrl} type={invoice?.file.type} width="100%" height="100%" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Loading preview...
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
