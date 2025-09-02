import type { AssessPrivacyConcernsOutput } from '@/ai/flows/assess-privacy-concerns';

export interface Invoice {
  id: string;
  file: File;
  invoiceNumber: string;
  invoiceDate: string;
  provider: string;
  amount: string;
  privacyAssessment: AssessPrivacyConcernsOutput;
}

export interface Provider {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  vatId: string;
}
