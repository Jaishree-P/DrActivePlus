"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Patient, type PatientSession } from "@/lib/types";
import { defaultPatients } from "@/lib/data";
import { notFound, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";


const formSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number is required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  treatmentPlan: z.string().optional(),
  medicines: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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

  const [patient, setPatient] = useState<Patient | undefined>(() => patients.find((p) => p.id === params.id));
  const [sessionDate, setSessionDate] = useState<Date | undefined>(new Date());


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    const currentPatient = patients.find((p) => p.id === params.id);
    setPatient(currentPatient);
    if (currentPatient) {
        reset({
            name: currentPatient.name,
            age: currentPatient.age,
            email: currentPatient.email,
            phone: currentPatient.phone,
            diagnosis: currentPatient.diagnosis,
            treatmentPlan: currentPatient.treatmentPlan,
            medicines: currentPatient.medicines,
        });
    }
  }, [params.id, patients, reset]);


  if (!patient) {
    notFound();
  }

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const updatedPatients = patients.map((p) =>
      p.id === params.id ? { ...p, ...data } : p
    );
    setPatients(updatedPatients);
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
      amount: patient.totalBill / patient.sessionsRequired,
      paid: false,
    };

    const updatedPatient = {
      ...patient,
      sessions: [...patient.sessions, newSession],
    };

    setPatient(updatedPatient);
    const updatedPatients = patients.map((p) => (p.id === patient.id ? updatedPatient : p));
    setPatients(updatedPatients);

    toast({
      title: "Session Added",
      description: `New session on ${format(sessionDate, 'PPP')} added for ${patient.name}.`,
    });
  };

  const handleDeleteSession = (sessionId: string) => {
    if (!patient) return;

    const updatedSessions = patient.sessions.filter(s => s.id !== sessionId);
    const updatedPatient = { ...patient, sessions: updatedSessions };

    setPatient(updatedPatient);
    const updatedPatients = patients.map((p) => (p.id === patient.id ? updatedPatient : p));
    setPatients(updatedPatients);

    toast({
      title: "Session Deleted",
      description: "The session has been removed.",
    });
  };

  const handleTogglePayment = (sessionId: string) => {
    if (!patient) return;

    const updatedSessions = patient.sessions.map(session => 
      session.id === sessionId ? { ...session, paid: !session.paid } : session
    );
    const updatedPatient = { ...patient, sessions: updatedSessions };

    setPatient(updatedPatient);
    const updatedPatients = patients.map(p => p.id === patient.id ? updatedPatient : p);
    setPatients(updatedPatients);
    
    const targetSession = updatedSessions.find(s => s.id === sessionId);
    toast({
      title: "Payment Updated",
      description: `Session marked as ${targetSession?.paid ? "Paid" : "Unpaid"}.`,
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
                                {patient.sessions.length > 0 ? (
                                    patient.sessions.map((session, index) => (
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
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Session Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {patient.sessions.length > 0 ? (
                                    patient.sessions.map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell>{format(new Date(session.date), "PPP")}</TableCell>
                                            <TableCell>Rs. {session.amount.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={session.paid ? "default" : "destructive"}>
                                                    {session.paid ? "Paid" : "Unpaid"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="secondary" size="sm" onClick={() => handleTogglePayment(session.id)}>
                                                    {session.paid ? "Mark Unpaid" : "Mark Paid"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">
                                            No session history for this patient.
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

    