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
  DropdownMenuSeparator,
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
import { MoreHorizontal, Download, Edit, Trash, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultDoctorProfile, defaultPatients, contactInfo } from "@/lib/data";
import { type Patient, type DoctorProfile } from "@/lib/types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

async function fetchImageAsBase64(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image as base64:", error);
    return ""; // Return empty string or a placeholder if fetch fails
  }
}


export default function PatientsTable() {
  const router = useRouter();
  const { toast } = useToast();
  const [patients, setPatients] = useLocalStorage<Patient[]>("patients", defaultPatients);
  const [doctorProfile] = useLocalStorage<DoctorProfile>(
    "doctor-profile",
    defaultDoctorProfile
  );
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const handleDelete = (patientId: string) => {
    setPatients(patients.filter((p) => p.id !== patientId));
    setPatientToDelete(null);
    toast({
        title: "Patient Deleted",
        description: "The patient record has been removed.",
    });
  };

  const handleDownloadBill = async (patient: Patient) => {
    const doc = new jsPDF();
    const docWidth = doc.internal.pageSize.getWidth();
    
    // --- Logo ---
    const logoBase64 = await fetchImageAsBase64('/logo.png');
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', 14, 15, 20, 20);
    }
    
    // --- Header ---
    doc.setFontSize(22);
    doc.setTextColor(217, 4, 41); // Red color for main title
    doc.setFont("helvetica", "bold");
    doc.text("DOCTOR ACTIVE PLUS", docWidth / 2, 22, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFont("helvetica", "normal");
    doc.text("Advance Spine | Joint & Laser Center", docWidth / 2, 29, { align: "center" });

    const addressLines = doc.splitTextToSize(contactInfo.address, docWidth - 40);
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
    const patientDetails = [
        { title: "Patient Name:", value: patient.name },
        { title: "Mobile:", value: patient.phone },
        { title: "Consultant Physio:", value: patient.consultantPhysio },
        { title: "Diagnosis:", value: patient.diagnosis },
        { title: "Treatment:", value: patient.treatmentPlan },
    ];
    
    let yPos = currentY;
    doc.setFontSize(10);
    patientDetails.forEach(detail => {
        doc.setFont("helvetica", "bold");
        doc.text(detail.title, 14, yPos);
        doc.setFont("helvetica", "normal");
        const valueXPos = 55;
        const valueLines = doc.splitTextToSize(detail.value, docWidth - valueXPos - 14);
        doc.text(valueLines, valueXPos, yPos);
        yPos += (valueLines.length * 4) + 2;
    });

    const sessionTableY = yPos > currentY + 20 ? yPos + 5 : currentY + 20;

    // Sort sessions and payments
    const sortedSessions = patient.sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const sortedPayments = (patient.payments || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // --- Session Dates Table ---
    if (sortedSessions && sortedSessions.length > 0) {
        autoTable(doc, {
            startY: sessionTableY,
            head: [['#', 'Session Date']],
            body: sortedSessions.map((session, index) => [
                index + 1,
                format(new Date(session.date), "dd MMM yyyy")
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: "#d90429", // Red
                textColor: 255,
                fontStyle: 'bold',
            },
            columnStyles: {
                0: { cellWidth: 10 },
            },
            margin: { left: 130 },
            tableWidth: docWidth - 144,
        });
    }

    let finalY = (doc as any).lastAutoTable.finalY || yPos;
    
    finalY += 10;

    // --- Payment Table ---
    if (sortedPayments && sortedPayments.length > 0) {
      autoTable(doc, {
        startY: finalY,
        head: [['#', 'Payment Date', 'Amount Paid']],
        body: sortedPayments.map((payment, index) => [
          index + 1,
          format(new Date(payment.date), "dd MMM yyyy"),
          `Rs. ${payment.amount.toFixed(2)}`
        ]),
        theme: 'grid',
        headStyles: {
          fillColor: "#d90429", // Red
          textColor: 255,
          fontStyle: 'bold',
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
    finalY += 10;
    const totalPaid = (patient.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const balanceDue = patient.totalBill - totalPaid;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Bill:', 14, finalY);
    doc.text(`Rs. ${patient.totalBill.toFixed(2)}`, docWidth - 14, finalY, { align: 'right' });

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


    doc.save(`invoice-${patient.name.replace(/\s/g, '-')}-${patient.id}.pdf`);
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
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/patients/${patient.id}`)}>
                            <Edit className="mr-2 h-4 w-4" /> Manage
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
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
