"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Patient } from "@/lib/types";
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
import { useEffect } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


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

  const patient = patients.find((p) => p.id === params.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    if (patient) {
        reset({
            name: patient.name,
            age: patient.age,
            email: patient.email,
            phone: patient.phone,
            diagnosis: patient.diagnosis,
            treatmentPlan: patient.treatmentPlan,
            medicines: patient.medicines,
        });
    }
  }, [patient, reset]);


  if (!patient) {
    // This can be a loading state in a real app
    // For now, if not found, redirect to 404
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

  return (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-3xl font-bold">Manage Patient</CardTitle>
                        <CardDescription>
                        View and edit patient details below.
                        </CardDescription>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/patients">Back to Patient List</Link>
                    </Button>
                </div>
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
        <Card>
            <CardHeader>
                <CardTitle>Session History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Session Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patient.sessions.length > 0 ? (
                            patient.sessions.map((session, index) => (
                                <TableRow key={index}>
                                    <TableCell>{format(new Date(session.date), "PPP p")}</TableCell>
                                    <TableCell>${session.amount.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={session.paid ? "default" : "destructive"}>
                                            {session.paid ? "Paid" : "Unpaid"}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                    No session history for this patient.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
