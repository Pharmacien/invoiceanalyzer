'use client';

import { useState, useEffect } from 'react';
import type { Provider } from '@/types';
import { Building, Copy, Edit, ExternalLink, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { EditProviderDialog } from './edit-provider-dialog';

type ProviderDetailsProps = {
  providers: Provider[];
  onUpdateProvider: (provider: Provider) => void;
  onDeleteProvider: (providerId: string) => void;
};

export function ProviderDetails({ providers, onUpdateProvider, onDeleteProvider }: ProviderDetailsProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (providers.length > 0) {
      if (!selectedProvider || !providers.find(p => p.id === selectedProvider.id)) {
        setSelectedProvider(providers[0]);
      }
    } else {
      setSelectedProvider(null);
    }
  }, [providers, selectedProvider]);

  const handleCopy = (text: string, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: `${fieldName} has been copied.`,
    });
  };

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Provider Information</CardTitle>
          <CardDescription>
            Select a provider from the list to view and manage their details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <h3 className="text-sm font-semibold mb-2 px-1">Providers</h3>
              <ScrollArea className="h-96 rounded-md border">
                <div className="p-2">
                  {providers.map(provider => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider)}
                      className={cn(
                        'w-full text-left p-2 rounded-md text-sm transition-colors',
                        selectedProvider?.id === provider.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent/50'
                      )}
                    >
                      {provider.name}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="md:col-span-2">
              {selectedProvider ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">{selectedProvider.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action will delete the provider. This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeleteProvider(selectedProvider.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <Input id="address" value={selectedProvider.address} readOnly className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(selectedProvider.address, 'Address')}>
                            <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Input id="phone" value={selectedProvider.phone} readOnly className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(selectedProvider.phone, 'Phone')}>
                            <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Input id="email" value={selectedProvider.email} readOnly className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(selectedProvider.email, 'Email')}>
                            <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="website">Website</Label>
                      <div className="relative flex items-center h-10 rounded-md border border-input bg-background px-3">
                        {selectedProvider.website ? (
                           <a
                           href={getFullUrl(selectedProvider.website)}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex-grow text-sm text-primary underline-offset-4 hover:underline truncate"
                         >
                           {selectedProvider.website}
                         </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not available</span>
                        )}
                        <div className="flex-shrink-0">
                          {selectedProvider.website && (
                             <a
                             href={getFullUrl(selectedProvider.website)}
                             target="_blank"
                             rel="noopener noreferrer"
                           >
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                            </a>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(selectedProvider.website, 'Website')}>
                              <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="vatId">VAT ID</Label>
                      <div className="relative">
                        <Input id="vatId" value={selectedProvider.vatId} readOnly className="pr-10" />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={() => handleCopy(selectedProvider.vatId, 'VAT ID')}>
                            <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed bg-secondary p-12 text-center">
                  <p className="text-sm text-muted-foreground">Select a provider to see their details.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedProvider && (
         <EditProviderDialog
            provider={selectedProvider}
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={onUpdateProvider}
          />
      )}
    </>
  );
}
