'use client';

import { useState } from 'react';
import type { Invoice, Provider } from '@/types';
import { extractInvoiceData } from '@/ai/flows/extract-invoice-data';
import { assessPrivacyConcerns } from '@/ai/flows/assess-privacy-concerns';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';

import { InvoiceUpload } from '@/components/bill-analyzer/invoice-upload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InvoiceTable } from '@/components/bill-analyzer/invoice-table';
import { ProviderDetails } from '@/components/bill-analyzer/provider-details';
import { EmptyState } from '@/components/bill-analyzer/empty-state';

function fileToDataURI(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const invoiceDataUri = await fileToDataURI(file);

      const [extractedData, privacyAssessment] = await Promise.all([
        extractInvoiceData({ invoiceDataUri }),
        assessPrivacyConcerns({ invoiceDataUri }),
      ]);
      
      const newInvoice: Invoice = {
        id: new Date().toISOString() + Math.random(),
        file,
        ...extractedData,
        privacyAssessment,
      };

      setInvoices(prev => [newInvoice, ...prev]);

      const providerExists = providers.some(p => p.name.toLowerCase() === newInvoice.provider.toLowerCase());
      if (!providerExists && newInvoice.provider) {
        const newProvider: Provider = {
          name: newInvoice.provider,
          address: '',
          phone: '',
          email: '',
          website: '',
          vatId: '',
        };
        setProviders(prev => [...prev, newProvider]);
      }

      toast({
        title: 'Extraction Successful',
        description: `Data for ${newInvoice.provider} has been extracted.`,
      });
    } catch (error) {
      console.error('Extraction failed:', error);
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: 'Could not extract data from the document. Please try a different file.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInvoices([]);
    setProviders([]);
    toast({
      title: 'Data Reset',
      description: 'All invoice and provider data has been cleared.',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Bill Analyzer</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <InvoiceUpload onFileUpload={handleFileUpload} isLoading={isLoading} />
          {invoices.length > 0 ? (
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="providers">Providers</TabsTrigger>
              </TabsList>
              <TabsContent value="invoices">
                <InvoiceTable invoices={invoices} setInvoices={setInvoices} onReset={handleReset} />
              </TabsContent>
              <TabsContent value="providers">
                <ProviderDetails providers={providers} setProviders={setProviders} />
              </TabsContent>
            </Tabs>
          ) : (
            !isLoading && <EmptyState />
          )}
        </div>
      </main>
    </div>
  );
}
