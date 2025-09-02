// Assess privacy concerns in invoice and return a warning if personal information is detected.

'use server';

/**
 * @fileOverview This file defines a Genkit flow to assess privacy concerns in an invoice.
 *
 * - assessPrivacyConcerns - A function that takes invoice data URI as input and returns a privacy assessment.
 * - AssessPrivacyConcernsInput - The input type for the assessPrivacyConcerns function.
 * - AssessPrivacyConcernsOutput - The return type for the assessPrivacyConcerns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessPrivacyConcernsInputSchema = z.object({
  invoiceDataUri: z
    .string()
    .describe(
      'The invoice document as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
});
export type AssessPrivacyConcernsInput = z.infer<typeof AssessPrivacyConcernsInputSchema>;

const AssessPrivacyConcernsOutputSchema = z.object({
  hasPrivacyConcerns: z
    .boolean()
    .describe('Whether the invoice contains personal information or privacy concerns.'),
  privacyConcernsDetails: z
    .string()
    .describe('Details about the identified privacy concerns, if any.'),
});
export type AssessPrivacyConcernsOutput = z.infer<typeof AssessPrivacyConcernsOutputSchema>;

export async function assessPrivacyConcerns(input: AssessPrivacyConcernsInput): Promise<AssessPrivacyConcernsOutput> {
  return assessPrivacyConcernsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessPrivacyConcernsPrompt',
  input: {schema: AssessPrivacyConcernsInputSchema},
  output: {schema: AssessPrivacyConcernsOutputSchema},
  prompt: `You are an AI assistant specialized in assessing privacy concerns in invoices.

  Analyze the provided invoice document and determine if it contains any personal information that could raise privacy concerns.

  Consider information such as names, addresses, phone numbers, email addresses, VAT IDs, and any other data that could be used to identify an individual or organization.

  Return a boolean value indicating whether privacy concerns are present and provide details about the identified concerns.

  Invoice: {{media url=invoiceDataUri}}
  `, // Added Handlebars media tag
});

const assessPrivacyConcernsFlow = ai.defineFlow(
  {
    name: 'assessPrivacyConcernsFlow',
    inputSchema: AssessPrivacyConcernsInputSchema,
    outputSchema: AssessPrivacyConcernsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
