"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Patient, type PatientSession, type PatientPayment } from "@/lib/types";
import { defaultPatients } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
import { useForm, SubmitHandler, useForm as usePaymentForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Skeleton } from "@/components/ui/skeleton";


const formSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number is required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  treatmentPlan: z.string().optional(),
  medicines: z.string().optional(),
});

const paymentFormSchema = z.object({
    amount: z.coerce.number().min(1, "Amount must be greater than 0"),
    date: z.date({ required_error: "Payment date is required" }),
});


type FormValues = z.infer<typeof formSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

type PatientDetailPageProps = {
  params: {
    id: string;
  };
};

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const [patients, setPatients] = useLocalStorage<Patient[]>(
    "patients",
    defaultPatients
  );
  const { toast } = useToast();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());
  
  const sortedSessions = useMemo(() => {
    if (!patient) return [];
    return [...patient.sessions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [patient]);

  const sortedPayments = useMemo(() => {
    if (!patient?.payments) return [];
    return [...patient.payments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [patient?.payments]);
  
  const totalPaid = useMemo(() => {
    return patient?.payments?.reduce((acc, payment) => acc + payment.amount, 0) || 0;
  }, [patient?.payments]);

  const balanceDue = useMemo(() => {
      return (patient?.totalBill || 0) - totalPaid;
  }, [patient?.totalBill, totalPaid]);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
   const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    reset: resetPaymentForm,
    control: paymentControl,
    formState: { errors: paymentErrors, isSubmitting: isSubmittingPayment },
  } = usePaymentForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
        date: new Date(),
        amount: 0,
    }
  });


  useEffect(() => {
    // The useLocalStorage hook might not have the latest data on initial render.
    // This effect will re-run when `patients` array is updated from local storage.
    const currentPatient = patients.find((p) => p.id === params.id);
    if (currentPatient) {
        if (!currentPatient.payments) {
            currentPatient.payments = [];
        }
        setPatient(currentPatient);
        reset({
            name: currentPatient.name,
            age: currentPatient.age,
            email: currentPatient.email,
            phone: currentPatient.phone,
            diagnosis: currentPatient.diagnosis,
            treatmentPlan: currentPatient.treatmentPlan,
            medicines: currentPatient.medicines,
        });
        setIsLoading(false);
    } else {
        // If patients have loaded but this one isn't found, it's a 404.
        if (patients.length > 0 || localStorage.getItem('patients') !== null) {
            notFound();
        }
    }
  }, [params.id, patients, reset]);


  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-10 w-36" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-32 self-end" />
                </CardContent>
            </Card>
        </div>
    )
  }
  
  if (!patient) {
    // This will be caught by the useEffect above, which calls notFound().
    // This is a fallback.
    return null;
  }
  
  const updatePatientInStorage = (updatedPatient: Patient) => {
      const updatedPatients = patients.map(p => p.id === updatedPatient.id ? updatedPatient : p);
      setPatients(updatedPatients);
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (!patient) return;
    const updatedPatient = { ...patient, ...data };
    setPatient(updatedPatient);
    updatePatientInStorage(updatedPatient);
    toast({
      title: "Patient Updated",
      description: `${data.name}'s record has been successfully updated.`,
    });
    reset(data); // to reset dirty state
  };

  const handleAddSession = () => {
    if (!sessionDate || !patient) return;

    const newSession: PatientSession = {
      id: uuidv4(),
      date: sessionDate.toISOString(),
    };

    const updatedPatient: Patient = {
      ...patient,
      sessions: [...patient.sessions, newSession],
    };

    setPatient(updatedPatient);
    updatePatientInStorage(updatedPatient);

    toast({
      title: "Session Added",
      description: `New session on ${format(sessionDate, 'PPP')} added for ${patient.name}.`,
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!patient) return;

    const updatedSessions = patient.sessions.filter(s => s.id !== sessionId);
    const updatedPatient: Patient = { ...patient, sessions: updatedSessions };

    setPatient(updatedPatient);
    updatePatientInStorage(updatedPatient);

    toast({
      title: "Session Deleted",
      description: "The session has been removed.",
    });
  };
  
  const onAddPayment: SubmitHandler<PaymentFormValues> = (data) => {
    if (!patient) return;
    
    const newPayment: PatientPayment = {
        id: uuidv4(),
        date: data.date.toISOString(),
        amount: data.amount,
    };

    const updatedPatient: Patient = {
        ...patient,
        payments: [...(patient.payments || []), newPayment],
    };

    setPatient(updatedPatient);
    updatePatientInStorage(updatedPatient);
    
    toast({
      title: "Payment Added",
      description: `Rs. ${data.amount.toFixed(2)} payment recorded for ${patient.name}.`,
    });
    resetPaymentForm({ amount: 0, date: new Date()});
  };
  
  const handleDeletePayment = (paymentId: string) => {
      if (!patient) return;
      
      const updatedPayments = (patient.payments || []).filter(p => p.id !== paymentId);
      const updatedPatient = { ...patient, payments: updatedPayments };

      setPatient(updatedPatient);
      updatePatientInStorage(updatedPatient);

      toast({
          title: "Payment Deleted",
          description: "The payment record has been removed.",
      });
  };


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Manage Patient</h1>
             <Button asChild variant="outline">
                <Link href="/dashboard/patients">Back to Patient List</Link>
            </Button>
        </div>

      <Tabs defaultValue="details">
            <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                        <CardDescription>
                        View and edit patient details below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" {...register("name")} />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" type="number" {...register("age")} />
                                    {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" {...register("phone")} />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="diagnosis">Diagnosis</Label>
                                <Input id="diagnosis" {...register("diagnosis")} />
                                {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="treatment-plan">Treatment Plan</Label>
                                <Textarea id="treatment-plan" rows={4} {...register("treatmentPlan")} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medicines">Medicines</Label>
                                <Textarea id="medicines" rows={4} {...register("medicines")} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="submit" disabled={isSubmitting || !isDirty}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="attendance">
                <Card>
                    <CardHeader>
                        <CardTitle>Session Attendance</CardTitle>
                        <CardDescription>
                            Total: {patient.sessions.length} / {patient.sessionsRequired}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                       <div className="flex items-center gap-4">
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                    "w-[280px] justify-start text-left font-normal",
                                    !sessionDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {sessionDate ? format(sessionDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={sessionDate}
                                    onSelect={setSessionDate}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                           <Button onClick={handleAddSession}>Add Session</Button>
                       </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedSessions.length > 0 ? (
                                    sortedSessions.map((session, index) => (
                                        <TableRow key={session.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{format(new Date(session.date), "MMMM do, yyyy")}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteSession(session.id)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24">
                                            No sessions recorded yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="payments">
                 <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Bill</p>
                                <p className="text-2xl font-bold">Rs. {patient.totalBill.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Paid</p>
                                <p className="text-2xl font-bold text-green-600">Rs. {totalPaid.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Balance Due</p>
                                <p className="text-2xl font-bold text-red-600">Rs. {balanceDue.toFixed(2)}</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmitPayment(onAddPayment)} className="flex items-end gap-4">
                            <div className="space-y-2 flex-grow">
                                <Label htmlFor="amount">Amount (Rs.)</Label>
                                <Input id="amount" type="number" {...registerPayment("amount")} />
                                {paymentErrors.amount && <p className="text-sm text-destructive">{paymentErrors.amount.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Controller
                                    control={paymentControl}
                                    name="date"
                                    render={({ field }) => (
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                />
                                {paymentErrors.date && <p className="text-sm text-destructive">{paymentErrors.date.message}</p>}
                            </div>
                           <Button type="submit" disabled={isSubmittingPayment}>{isSubmittingPayment ? "Adding..." : "Add Payment"}</Button>
                        </form>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedPayments && sortedPayments.length > 0 ? (
                                    sortedPayments.map((payment, index) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{format(new Date(payment.date), "PPP")}</TableCell>
                                            <TableCell>Rs. {payment.amount.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                 <Button variant="ghost" size="icon" onClick={() => handleDeletePayment(payment.id)}>
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">
                                            No payment history for this patient.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
