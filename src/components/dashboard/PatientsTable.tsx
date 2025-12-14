
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
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
      const safeNumber = (num: any) => {
          const number = Number(num);
          return isNaN(number) ? 0 : number;
      };
      
      const safeDate = (dateStr: any) => {
        if (!dateStr) return "N/A";
        const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
        return isValid(date) ? format(date, 'dd MMM yyyy') : "N/A";
      };
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(185, 28, 28);
      doc.text("Doctor Active Plus", 14, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("PHYSIOTHERAPY & PAIN CLINIC", 14, yPos);
      yPos += 5;
      
      const address = safeString(contactInfo.address);
      const addressLines = doc.splitTextToSize(address, docWidth - 28);
      doc.text(addressLines, 14, yPos);
      yPos += (addressLines.length * 4) + 2;

      doc.text(`Mobile: ${safeString(contactInfo.phone)} | Email: ${safeString(contactInfo.email)}`, 14, yPos);
      yPos += 6;

      doc.setDrawColor(220, 53, 69);
      doc.setLineWidth(0.5);
      doc.line(14, yPos, docWidth - 14, yPos);
      yPos += 10;


      // Patient Details & Bill Info
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Patient Name: ${safeString(patient.name)}`, 14, yPos);
      doc.text(`Bill Number: ${safeString(patient.billNumber)}`, docWidth - 14, yPos, { align: 'right' });
      yPos += 7;
      doc.text(`Date: ${safeDate(new Date())}`, 14, yPos);
      yPos += 10;

      const patientDetailsStartY = yPos;
      
      const patientDetails = [
        { title: "Age:", value: safeString(patient.age) },
        { title: "Mobile:", value: safeString(patient.phone) },
        { title: "Consultant Physio:", value: safeString(patient.consultantPhysio) },
        { title: "Diagnosis:", value: safeString(patient.diagnosis) },
        { title: "Treatment:", value: safeString(patient.treatmentPlan) }
      ];

      patientDetails.forEach(detail => {
        const lines = doc.splitTextToSize(`${detail.title} ${detail.value}`, 90);
        doc.text(lines, 14, yPos);
        yPos += lines.length * 7;
      });
      
      const patientDetailsEndY = yPos;
      
      // Session Table (parallel to patient details)
      const sessions = patient.sessions || [];
      let sessionsTableFinalY = 0;
      if (sessions.length > 0) {
        autoTable(doc, {
          startY: patientDetailsStartY,
          head: [['#', 'Session Date']],
          body: sessions.map((s, i) => [i + 1, safeDate(s.date)]),
          theme: 'grid',
          headStyles: { fillColor: [185, 28, 28] },
          margin: { left: 110 }
        });
        sessionsTableFinalY = (doc as any).lastAutoTable.finalY || 0;
      }
      
      let lastY = Math.max(patientDetailsEndY, sessionsTableFinalY) + 10;
      
      // Payments Table
      const payments = patient.payments || [];
      if (payments.length > 0) {
        autoTable(doc, {
          startY: lastY,
          head: [['#', 'Payment Date', 'Amount Paid']],
          body: payments.map((p, i) => [i + 1, safeDate(p.date), `Rs. ${safeNumber(p.amount).toFixed(2)}`]),
          theme: 'grid',
          headStyles: { fillColor: [185, 28, 28] },
          didDrawPage: (data) => {
            lastY = data.cursor?.y ?? lastY;
          },
          columnStyles: { 2: { halign: 'right' } }
        });
        lastY = (doc as any).lastAutoTable.finalY + 10;
      }

      // Totals
      const totalBill = safeNumber(patient.totalBill);
      const totalPaid = (patient.payments || []).reduce((acc, p) => acc + safeNumber(p.amount), 0);
      const balanceDue = totalBill - totalPaid;
      
      doc.setFontSize(10);
      const totals = [
        { label: 'Total Bill:', value: `Rs. ${totalBill.toFixed(2)}` },
        { label: 'Total Paid:', value: `Rs. ${totalPaid.toFixed(2)}` },
        { label: 'Balance Due:', value: `Rs. ${balanceDue.toFixed(2)}` }
      ];

      autoTable(doc, {
        startY: lastY,
        body: totals,
        theme: 'plain',
        columnStyles: {
            0: { fontStyle: 'bold' },
            1: { halign: 'right' }
        }
      });
      lastY = (doc as any).lastAutoTable.finalY + 20;

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      let footerY = pageHeight - 40; // Position footer from bottom
      if (lastY > footerY) {
         footerY = lastY + 10;
         if (footerY > pageHeight - 40) {
            doc.addPage();
            footerY = 20;
         }
      }
      
      doc.setFontSize(10);
      doc.text("Seal & Sign", docWidth - 14, footerY, { align: 'right' });
      footerY += 15;

      const noteText = "Note: All services are provided under the supervision of qualified medical professionals. Results may vary from person to person. We will do the best. Package treatment must be completed in given time period. (Package treatment fee will not be refunded under any circumstances.) \n© 2025 Dr. Movement Rx. All Rights Reserved";
      const noteLines = doc.splitTextToSize(noteText, docWidth - 28);
      doc.setFontSize(8);
      doc.text(noteLines, docWidth / 2, footerY, { align: 'center' });


      const dataUri = doc.output('datauristring');
      setPdfPreview({ dataUri, patient });

    } catch (error) {
      console.error("Failed to generate PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please check the console for details.",
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
