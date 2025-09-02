'use client';

import { useState, useEffect } from 'react';
import type { Provider } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Building, Save } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const providerSchema = z.object({
  name: z.string(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  vatId: z.string().optional(),
});

type ProviderDetailsProps = {
  providers: Provider[];
  setProviders: React.Dispatch<React.SetStateAction<Provider[]>>;
};

export function ProviderDetails({ providers, setProviders }: ProviderDetailsProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof providerSchema>>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      vatId: '',
    },
  });

  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      setSelectedProvider(providers[0]);
    }
    if (selectedProvider) {
      form.reset(selectedProvider);
    } else {
      form.reset({ name: '', address: '', phone: '', email: '', website: '', vatId: '' });
    }
  }, [selectedProvider, providers, form]);

  const onSubmit = (data: z.infer<typeof providerSchema>) => {
    setProviders(prev =>
      prev.map(p => (p.name === selectedProvider?.name ? { ...p, ...data } : p))
    );
    toast({
      title: 'Provider Saved',
      description: `Details for ${data.name} have been updated.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider Information</CardTitle>
        <CardDescription>
          Select a provider from the list to view or edit their details.
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    {selectedProvider.name}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl><Input placeholder="123 Main St, City" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="contact@provider.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="website" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl><Input placeholder="https://provider.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="vatId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>VAT ID</FormLabel>
                        <FormControl><Input placeholder="Tax or VAT number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </form>
              </Form>
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
