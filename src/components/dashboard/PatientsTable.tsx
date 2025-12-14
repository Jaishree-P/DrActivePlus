
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreHorizontal, Download, Trash, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultPatients, contactInfo } from "@/lib/data";
import { type Patient } from "@/lib/types";
import { format, isValid, parseISO } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { logoBase64 } from "@/lib/logo-base64";


export default function PatientsTable() {
  const router = useRouter();
  const { toast } = useToast();
  const [patients, setPatients] = useLocalStorage<Patient[]>("patients", defaultPatients);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [pdfPreview, setPdfPreview] = useState<{dataUri: string, patient: Patient} | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDelete = (patientId: string) => {
    setPatients(patients.filter((p) => p.id !== patientId));
    setPatientToDelete(null);
    toast({
        title: "Patient Deleted",
        description: "The patient record has been removed.",
    });
  };
  
  const handleDownloadBill = (patient: Patient) => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF();
      const docWidth = doc.internal.pageSize.getWidth();
      let yPos = 20;

      const safeString = (str: any) => (str || '').toString();
      const safeNumber = (num: any) => Number(num) || 0;
      const safeDate = (dateStr: any) => {
        if (!dateStr) return "N/A";
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        return isValid(date) ? format(date, 'PPP') : "N/A";
      };
      
      const checkYPos = (increment = 10) => {
        if (yPos + increment > 280) {
          doc.addPage();
          yPos = 20;
        }
      };
      
      // Header
      doc.addImage(logoBase64, 'PNG', 14, 15, 20, 20);
      doc.setFontSize(18);
      doc.text("DOCTOR ACTIVE PLUS", 40, 22);
      doc.setFontSize(10);
      doc.text("Advance Spine | Joint & Laser Center", 40, 28);
      
      const address = safeString(contactInfo.address);
      const addressLines = doc.splitTextToSize(address, docWidth - 100);
      doc.text(addressLines, docWidth - 14, 20, { align: 'right' });
      yPos = doc.getTextDimensions(addressLines).h + 22;

      doc.text(`Phone: ${safeString(contactInfo.phone)}`, docWidth - 14, yPos, { align: 'right' });
      doc.text(`Email: ${safeString(contactInfo.email)}`, docWidth - 14, yPos + 5, { align: 'right' });

      yPos += 15;
      doc.setLineWidth(0.5);
      doc.line(14, yPos, docWidth - 14, yPos);
      yPos += 10;
      
      doc.setFontSize(14);
      doc.text("INVOICE", docWidth / 2, yPos, { align: 'center'});
      yPos += 10;

      // Patient Info
      doc.setFontSize(10);
      doc.text(`Patient Name: ${safeString(patient.name)}`, 14, yPos);
      doc.text(`Bill No: ${safeString(patient.billNumber)}`, docWidth - 14, yPos, { align: 'right' });
      yPos += 7;

      doc.text(`Patient ID: ${(safeString(patient.id)).substring(0, 8)}`, 14, yPos);
      doc.text(`Date: ${safeDate(patient.registrationDate)}`, docWidth - 14, yPos, { align: 'right' });
      yPos += 15;

      const sessions = patient.sessions || [];
      if (sessions.length > 0) {
        checkYPos(20);
        doc.setFontSize(12);
        doc.text('Session Attendance', 14, yPos);
        yPos += 8;
        
        doc.setFontSize(10);
        doc.setLineWidth(0.2);
        doc.line(14, yPos, docWidth - 14, yPos);
        yPos += 6;
        doc.text('Session Date', 16, yPos);
        yPos += 2;
        doc.line(14, yPos, docWidth - 14, yPos);
        yPos += 6;

        sessions.forEach(s => {
          checkYPos();
          doc.text(safeDate(s.date), 16, yPos);
          yPos += 7;
        });
        yPos += 5;
      }
      
      const payments = patient.payments || [];
      if (payments.length > 0) {
        checkYPos(20);
        doc.setFontSize(12);
        doc.text('Payment History', 14, yPos);
        yPos += 8;

        doc.setFontSize(10);
        doc.setLineWidth(0.2);
        doc.line(14, yPos, docWidth - 14, yPos);
        yPos += 6;
        doc.text('Payment Date', 16, yPos);
        doc.text('Amount (Rs.)', docWidth - 16, yPos, {align: 'right'});
        yPos += 2;
        doc.line(14, yPos, docWidth - 14, yPos);
        yPos += 6;

        payments.forEach(p => {
          checkYPos();
          doc.text(safeDate(p.date), 16, yPos);
          doc.text(safeNumber(p.amount).toFixed(2), docWidth - 16, yPos, {align: 'right'});
          yPos += 7;
        });
        yPos += 5;
      }

      checkYPos(40);

      const totalBill = safeNumber(patient.totalBill);
      const totalPaid = (patient.payments || []).reduce((acc, p) => acc + safeNumber(p.amount), 0);
      const balanceDue = totalBill - totalPaid;

      yPos += 10;
      doc.setFontSize(12);
      const totalsX = docWidth / 2 > 100 ? docWidth / 2 : 100;
      
      doc.text('Total Bill:', totalsX, yPos);
      doc.text(`Rs. ${totalBill.toFixed(2)}`, docWidth - 14, yPos, { align: 'right' });
      yPos += 7;

      doc.text('Total Paid:', totalsX, yPos);
      doc.text(`Rs. ${totalPaid.toFixed(2)}`, docWidth - 14, yPos, { align: 'right' });
      yPos += 7;
      
      doc.setFontSize(12);
      doc.text('Balance Due:', totalsX, yPos);
      doc.text(`Rs. ${balanceDue.toFixed(2)}`, docWidth - 14, yPos, { align: 'right' });

      yPos += 15;
      doc.line(14, yPos, docWidth - 14, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.text("Thank you for choosing Doctor Active Plus!", docWidth / 2, yPos, { align: 'center'});

      const dataUri = doc.output('datauristring');
      setPdfPreview({ dataUri, patient });

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "An unexpected error occurred. Please check the console for details.",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };
  
  const triggerDownload = () => {
    if (!pdfPreview) return;
    const { patient } = pdfPreview;
    
    const link = document.createElement('a');
    link.href = pdfPreview.dataUri;
    link.download = `invoice-${(patient.name || 'patient').replace(/\s/g, '-')}-${patient.billNumber || 'na'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setPdfPreview(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{patient.diagnosis}</Badge>
                    </TableCell>
                    <TableCell>{format(new Date(patient.registrationDate), 'yyyy-MM-dd')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isGeneratingPdf}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadBill(patient)}>
                            <Download className="mr-2 h-4 w-4" /> {isGeneratingPdf ? 'Generating...' : 'Download Bill'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setPatientToDelete(patient)}
                          >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No patients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {pdfPreview && (
        <Dialog open={!!pdfPreview} onOpenChange={(open) => !open && setPdfPreview(null)}>
          <DialogContent className="max-w-4xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>Bill Preview for {pdfPreview.patient.name}</DialogTitle>
            </DialogHeader>
            <div className="h-full flex-grow border rounded-md overflow-hidden">
                <iframe src={pdfPreview.dataUri} className="w-full h-full" title="Bill Preview" />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setPdfPreview(null)}>Close</Button>
                <Button onClick={triggerDownload}><Download className="mr-2 h-4 w-4"/>Download PDF</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {patientToDelete && (
        <AlertDialog open={!!patientToDelete} onOpenChange={(open) => !open && setPatientToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the patient record for {patientToDelete.name}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPatientToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(patientToDelete.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

    