
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
        
        doc.text("Hello World", 10, 10);
        
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
    link.download = `invoice-${patient.name.replace(/\s/g, '-')}-${patient.billNumber}.pdf`;
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
