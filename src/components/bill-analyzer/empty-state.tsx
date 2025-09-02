'use client';

import { FileText } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
        <FileText className="h-6 w-6 text-secondary-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">No Bills Analyzed Yet</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Upload a bill document to get started. The extracted data will appear here.
      </p>
    </div>
  );
}
