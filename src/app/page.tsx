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

  const handleFileUpload = async (files: File[]) => {
    setIsLoading(true);
    try {
      const newInvoices: Invoice[] = [];
      const newProvidersMap = new Map<string, Provider>();

      for (const file of files) {
        try {
          const invoiceDataUri = await fileToDataURI(file);

          const [extractedData, privacyAssessment] = await Promise.all([
            extractInvoiceData({ invoiceDataUri }),
            assessPrivacyConcerns({ invoiceDataUri }),
          ]);
          
          const {
            provider: providerName,
            providerAddress,
            providerEmail,
            providerPhone,
            providerVatId,
            providerWebsite,
            ...invoiceDetails
          } = extractedData;

          const newInvoice: Invoice = {
            id: new Date().toISOString() + Math.random(),
            file,
            provider: providerName,
            ...invoiceDetails,
            privacyAssessment,
          };
          newInvoices.push(newInvoice);
          
          const providerKey = providerName.toLowerCase();
          if (providerName && !newProvidersMap.has(providerKey)) {
             const existingProvider = providers.find(p => p.name.toLowerCase() === providerKey);
             if (!existingProvider) {
                const newProvider: Provider = {
                    id: new Date().toISOString() + Math.random() + providerName,
                    name: providerName,
                    address: providerAddress || '',
                    phone: providerPhone || '',
                    email: providerEmail || '',
                    website: providerWebsite || '',
                    vatId: providerVatId || '',
                };
                newProvidersMap.set(providerKey, newProvider);
             }
          }

        } catch (error) {
            console.error('Extraction failed for one file:', error);
            toast({
                variant: 'destructive',
                title: 'Extraction Failed',
                description: `Could not extract data from ${file.name}. Please try again.`,
            });
        }
      }
      
      const newProviders = Array.from(newProvidersMap.values());

      if (newInvoices.length > 0) {
        setInvoices(prev => [...newInvoices, ...prev]);
        setProviders(prev => [...newProviders, ...prev]);

        toast({
          title: 'Extraction Successful',
          description: `${newInvoices.length} bill(s) have been processed.`,
        });
      }

    } catch (error) {
      console.error('Extraction failed:', error);
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: 'An error occurred during the extraction process.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdateProvider = (updatedProvider: Provider) => {
    setProviders(providers.map(p => p.id === updatedProvider.id ? updatedProvider : p));
    toast({
      title: 'Provider Updated',
      description: 'The provider details have been updated.',
    });
  };

  const handleDeleteProvider = (providerId: string) => {
    setProviders(providers.filter(p => p.id !== providerId));
    toast({
      title: 'Provider Deleted',
      description: 'The provider has been removed.',
    });
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
                <ProviderDetails 
                  providers={providers}
                  onUpdateProvider={handleUpdateProvider}
                  onDeleteProvider={handleDeleteProvider}
                 />
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
