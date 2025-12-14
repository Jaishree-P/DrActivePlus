"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
import { format } from "date-fns";
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
        let finalY = 0;
        
        // --- Logo & Header ---
        doc.setFontSize(22);
        doc.setTextColor(217, 4, 41); // Red color for main title

        const clinicTitle = "DOCTOR ACTIVE PLUS";
        const titleWidth = doc.getTextWidth(clinicTitle);
        const logoWidth = 20;
        const logoGap = 4;
        const totalHeaderWidth = logoWidth + logoGap + titleWidth;
        const headerStartX = (docWidth - totalHeaderWidth) / 2;
        
        if (logoBase64) {
            doc.addImage(logoBase64, 'PNG', headerStartX, 15, logoWidth, 20);
        }
        
        doc.text(clinicTitle, headerStartX + logoWidth + logoGap, 22);

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0); // Black color
        doc.text("Advance Spine | Joint & Laser Center", docWidth / 2, 29, { align: "center" });

        const address = contactInfo?.address || '';
        const addressLines = doc.splitTextToSize(address, docWidth - 40);
        doc.text(addressLines, docWidth / 2, 35, { align: "center" });
        let currentY = 35 + (addressLines.length * 5);

        // --- Red Lines & GSTIN ---
        doc.setDrawColor(217, 4, 41);
        doc.setLineWidth(0.5);
        doc.line(14, currentY + 2, docWidth - 14, currentY + 2);
        
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("A unit of Speed Plus Health Initiatives | GSTIN: 29AOTPY4559F1ZX", docWidth / 2, currentY + 6, { align: "center" });

        doc.line(14, currentY + 9, docWidth - 14, currentY + 9);
        currentY += 15;

        // --- Patient Details ---
        let yPos = currentY;
        doc.setFontSize(10);
        doc.setTextColor(0,0,0);


        doc.text("Patient Name:", 14, yPos);
        const patientName = patient?.name || "";
        const patientNameLines = doc.splitTextToSize(patientName, docWidth - 14 - 55);
        doc.text(patientNameLines, 55, yPos);
        
        doc.text("Bill Number:", docWidth - 60, yPos);
        doc.text(patient?.billNumber || "", docWidth - 14, yPos, { align: 'right' });
        
        yPos += (patientNameLines.length * 5) + 2;
        
        const patientDetails = [
            { title: "Mobile:", value: patient?.phone || "" },
            { title: "Consultant Physio:", value: patient?.consultantPhysio || "" },
            { title: "Diagnosis:", value: patient?.diagnosis || "" },
            { title: "Treatment:", value: patient?.treatmentPlan || "" },
        ];
        
        patientDetails.forEach(detail => {
            doc.text(detail.title, 14, yPos);
            const valueLines = doc.splitTextToSize(detail.value, docWidth - 55 - 14);
            doc.text(valueLines, 55, yPos);
            yPos += (valueLines.length * 5) + 2;
        });

        finalY = yPos;

        const sortedSessions = (patient?.sessions || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const sortedPayments = (patient?.payments || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        // --- Session Dates Table ---
        if (sortedSessions && sortedSessions.length > 0) {
            autoTable(doc, {
                startY: finalY,
                head: [['#', 'Session Date']],
                body: sortedSessions.map((session, index) => [
                    index + 1,
                    format(new Date(session.date), "dd MMM yyyy")
                ]),
                theme: 'grid',
                headStyles: {
                    fillColor: "#d90429", // Red
                    textColor: 255,
                },
                columnStyles: {
                    0: { cellWidth: 10 },
                },
                margin: { left: 14, right: 14 },
                tableWidth: docWidth - 28,
            });
            finalY = (doc as any).lastAutoTable.finalY;
        }

        // --- Payment Table ---
        if (sortedPayments && sortedPayments.length > 0) {
          finalY = (doc as any).lastAutoTable ? Math.max(finalY, (doc as any).lastAutoTable.finalY + 5) : finalY + 5;
          autoTable(doc, {
            startY: finalY,
            head: [['#', 'Payment Date', 'Amount Paid']],
            body: sortedPayments.map((payment, index) => [
              index + 1,
              format(new Date(payment.date), "dd MMM yyyy"),
              `Rs. ${(Number(payment.amount) || 0).toFixed(2)}`
            ]),
            theme: 'grid',
            headStyles: {
              fillColor: "#d90429", // Red
              textColor: 255,
            },
            columnStyles: {
              0: { cellWidth: 10 },
              2: { halign: 'right' }
            },
            margin: { left: 14, right: 14 },
          });
          finalY = (doc as any).lastAutoTable.finalY;
        }

        // --- Totals ---
        const checkAndAddPage = (spaceNeeded: number) => {
            if (finalY + spaceNeeded > doc.internal.pageSize.getHeight() - 30) { // 30 for footer margin
                doc.addPage();
                finalY = 20; // Reset Y position on new page
            }
        };

        checkAndAddPage(40); // Space for totals
        finalY += 10;
        
        const totalPaid = (patient?.payments || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const totalBillAmount = Number(patient?.totalBill) || 0;
        const balanceDue = totalBillAmount - totalPaid;

        doc.setFontSize(10);
        doc.text('Total Bill:', 14, finalY);
        doc.text(`Rs. ${totalBillAmount.toFixed(2)}`, docWidth - 14, finalY, { align: 'right' });

        finalY += 7;
        doc.text('Total Paid:', 14, finalY);
        doc.text(`Rs. ${totalPaid.toFixed(2)}`, docWidth - 14, finalY, { align: 'right' });
        
        finalY += 7;
        doc.setDrawColor(150, 150, 150);
        doc.setLineWidth(0.2);
        doc.line(14, finalY, docWidth - 14, finalY);
        finalY += 7;
        
        doc.setFontSize(12);
        doc.setTextColor("#d90429");
        doc.text("Balance Due:", 14, finalY);
        doc.text(`Rs. ${balanceDue.toFixed(2)}`, docWidth - 14, finalY, { align: 'right' });
        
        const pageHeight = doc.internal.pageSize.getHeight();
        let footerY = pageHeight - 30;

        // Make sure footer doesn't overlap content
        if (finalY > footerY - 20) {
            doc.addPage();
            footerY = pageHeight - 30;
        }

        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const sealSignText = "Seal & Sign";
        const sealSignWidth = doc.getTextWidth(sealSignText);
        doc.text(sealSignText, docWidth - 14 - sealSignWidth, footerY - 5);
        
        const note = "Note: All services are provided under the supervision of qualified medical professionals. Results may vary from person to person. We will do the best. Package treatment must be completed in given time period. (Package treatment fee will not be refunded under any circumstances.)\n© 2025 Dr. Movement Rx. All Rights Reserved";

        doc.setFontSize(8);
        doc.setTextColor(100);
        const noteLines = doc.splitTextToSize(note, docWidth - 28);
        doc.text(noteLines, docWidth / 2, footerY + 5, { align: 'center' });
        
        const dataUri = doc.output('datauristring');
        setPdfPreview({ dataUri, patient });
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        toast({
            variant: "destructive",
            title: "PDF Generation Failed",
            description: "There was an error while creating the bill. Please try again.",
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
    link.download = `invoice-${patient.name.replace(/\s/g, '-')}-${patient.id}.pdf`;
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
                            <Download className="mr-2 h-4 w-4" /> Download Bill
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
