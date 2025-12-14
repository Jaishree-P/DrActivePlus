

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
      let yPos = 15;

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
      doc.setTextColor(220, 53, 69); // Red
      doc.text("Dr. Movement Rx", docWidth / 2, yPos, { align: 'center'});
      yPos += 7;

      doc.setFontSize(10);
      doc.setTextColor(13, 110, 253); // Blue
      doc.text("HEALTHCARE", docWidth / 2, yPos, { align: 'center'});
      yPos += 4;
      doc.setDrawColor(13, 110, 253);
      doc.setLineWidth(0.5);
      doc.line(docWidth / 2 - 10, yPos, docWidth / 2 + 10, yPos);
      yPos += 5;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black
      doc.text("PHYSIOTHERAPY & PAIN CLINIC", docWidth / 2, yPos, { align: 'center'});
      yPos += 8;

      doc.setFontSize(9);
      doc.text("Plot no 93 & 94, Lake View Enclave, Medahalli Kadugodi Road, Seegehalli,", docWidth / 2, yPos, { align: 'center' });
      yPos += 4;
      doc.text("Bengaluru, Karnataka - 560049.", docWidth / 2, yPos, { align: 'center' });
      yPos += 4;
      doc.text(`Mobile: +91 98446 67272 | Email: drmovementrx@gmail.com`, docWidth / 2, yPos, { align: 'center' });
      yPos += 6;

      doc.setDrawColor(220, 53, 69); // Red
      doc.line(14, yPos, docWidth - 14, yPos);
      yPos += 5;

      doc.setTextColor(220, 53, 69);
      doc.text("A unit of Speed Plus Health Initiatives | GSTIN: 29AOTPY4559F1ZX.", docWidth / 2, yPos, { align: 'center' });
      yPos += 15;


      // Patient Details
      let patientDetailsY = yPos;
      const patientDetails = [
        { title: "Patient Name:", value: safeString(patient.name) },
        { title: "Age:", value: safeString(patient.age) },
        { title: "Mobile:", value: safeString(patient.phone) },
        { title: "Consultant Physio:", value: safeString(patient.consultantPhysio) },
        { title: "Diagnosis:", value: safeString(patient.diagnosis) },
        { title: "Treatment:", value: safeString(patient.treatmentPlan) }
      ];

      doc.setFont("helvetica", "bold");
      patientDetails.forEach(detail => {
        doc.text(detail.title, 14, patientDetailsY);
        doc.setFont("helvetica", "normal");
        const valueLines = doc.splitTextToSize(detail.value, 80);
        doc.text(valueLines, 55, patientDetailsY);
        patientDetailsY += (valueLines.length > 1 ? valueLines.length * 5 : 7);
        doc.setFont("helvetica", "bold");
      });
      doc.setFont("helvetica", "normal");


      // Session Table
      const sessions = patient.sessions || [];
      if (sessions.length > 0) {
        autoTable(doc, {
          startY: yPos,
          margin: { left: 110 },
          head: [['#', 'Session Date']],
          body: sessions.map((s, i) => [i + 1, safeDate(s.date)]),
          theme: 'grid',
          headStyles: {
            fillColor: [28, 158, 146], // Teal Green
            textColor: 255
          },
          styles: { fontSize: 9 },
          columnStyles: { 0: { cellWidth: 10 } }
        });
      }
      
      const finalY = (doc as any).lastAutoTable.finalY || patientDetailsY;

      // Payments Table
      let paymentY = finalY + 15;
      if (patientDetailsY > finalY) {
        paymentY = patientDetailsY + 15;
      }

      const payments = patient.payments || [];
      if (payments.length > 0) {
        autoTable(doc, {
          startY: paymentY,
          margin: { left: 14, right: 14 },
          head: [['#', 'Payment Date', 'Amount Paid']],
          body: payments.map((p, i) => [i + 1, safeDate(p.date), `Rs. ${safeNumber(p.amount).toFixed(2)}`]),
          theme: 'grid',
          headStyles: {
            fillColor: [28, 158, 146], // Teal Green
            textColor: 255
          },
          styles: { fontSize: 9 },
          columnStyles: { 
            0: { cellWidth: 10, halign: 'center' },
            2: { halign: 'right' }
          }
        });
      }

      const paymentFinalY = (doc as any).lastAutoTable.finalY || paymentY;
      
      // Balance Due
      const totalBill = safeNumber(patient.totalBill);
      const totalPaid = (patient.payments || []).reduce((acc, p) => acc + safeNumber(p.amount), 0);
      const balanceDue = totalBill - totalPaid;
      
      const balanceY = paymentFinalY + 10;
      doc.setFontSize(10);
      doc.setTextColor(0, 128, 0); // Green
      doc.setFont("helvetica", "bold");
      doc.text('Balance Due:', 14, balanceY);
      doc.text(`Rs. ${balanceDue.toFixed(2)}`, 55, balanceY);

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
