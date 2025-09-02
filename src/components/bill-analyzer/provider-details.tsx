'use client';

import { useState, useEffect } from 'react';
import type { Provider } from '@/types';
import { Building } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ProviderDetailsProps = {
  providers: Provider[];
};

export function ProviderDetails({ providers }: ProviderDetailsProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      setSelectedProvider(providers[0]);
    }
  }, [providers, selectedProvider]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Information</CardTitle>
        <CardDescription>
          Select a provider from the list to view their details extracted from the invoices.
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
                    key={provider.name}
                    onClick={() => setSelectedProvider(provider)}
                    className={cn(
                      'w-full text-left p-2 rounded-md text-sm transition-colors',
                      selectedProvider?.name === provider.name
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
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  {selectedProvider.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={selectedProvider.address} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={selectedProvider.phone} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={selectedProvider.email} readOnly />
                  </div>
                   <div className="space-y-1">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={selectedProvider.website} readOnly />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="vatId">VAT ID</Label>
                    <Input id="vatId" value={selectedProvider.vatId} readOnly />
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
  );
}
