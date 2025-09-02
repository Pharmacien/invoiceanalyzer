'use client';

import { useState } from 'react';
import type { Invoice } from '@/types';
import { exportToCsv } from '@/lib/utils';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, FileDown, RotateCcw, Eye, Edit, Trash2 } from 'lucide-react';
import { InvoicePreviewDialog } from './invoice-preview-dialog';
import { EditInvoiceDialog } from './edit-invoice-dialog';
import { useToast } from '@/hooks/use-toast';

type InvoiceTableProps = {
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  onReset: () => void;
};

export function InvoiceTable({ invoices, setInvoices, onReset }: InvoiceTableProps) {
  const [invoiceToPreview, setInvoiceToPreview] = useState<Invoice | null>(null);
  const [invoiceToEdit, setInvoiceToEdit] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const handleExport = () => {
    const dataToExport = invoices.map(({ id, file, privacyAssessment, ...rest }) => rest);
    exportToCsv('invoices.csv', dataToExport);
    toast({ title: 'Export Successful', description: 'Invoice data has been exported to invoices.csv.' });
  };

  const handleDelete = (invoiceId: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
    toast({ title: 'Invoice Deleted', description: 'The invoice has been removed from the list.' });
  };

  const handleSaveEdit = (updatedInvoice: Invoice) => {
    setInvoices(invoices.map(inv => (inv.id === updatedInvoice.id ? updatedInvoice : inv)));
    toast({ title: 'Invoice Updated', description: 'Your changes have been saved.' });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Extracted Data</CardTitle>
          <CardDescription>
            Review and manage the data extracted from your bills. You can edit or delete each entry.
          </CardDescription>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={handleExport} disabled={invoices.length === 0} className="w-full sm:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
            <Button variant="outline" onClick={onReset} disabled={invoices.length === 0} className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.invoiceDate}</TableCell>
                    <TableCell>{invoice.provider}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setInvoiceToPreview(invoice)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setInvoiceToEdit(invoice)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                <span className="text-destructive">Delete</span>
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the
                                  invoice data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(invoice.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InvoicePreviewDialog
        invoice={invoiceToPreview}
        isOpen={!!invoiceToPreview}
        onOpenChange={(isOpen) => !isOpen && setInvoiceToPreview(null)}
      />
      <EditInvoiceDialog
        invoice={invoiceToEdit}
        isOpen={!!invoiceToEdit}
        onOpenChange={(isOpen) => !isOpen && setInvoiceToEdit(null)}
        onSave={handleSaveEdit}
      />
    </>
  );
}
