
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Patient } from "@/lib/types";
import { defaultPatients } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  age: z.coerce.number().min(0, "Age must be a positive number"),
  phone: z.string().min(10, "Phone number is required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  treatmentPlan: z.string().optional(),
  medicines: z.string().optional(),
  sessionsRequired: z.coerce.number().min(0, "Sessions must be a positive number"),
  totalBill: z.coerce.number().min(0, "Total bill must be a positive number"),
  consultantPhysio: z.string().min(2, "Consultant Physio is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPatientPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [patients, setPatients] = useLocalStorage<Patient[]>("patients", defaultPatients);
    const [newPatientId, setNewPatientId] = useState<string | null>(null);


    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            age: 0,
            sessionsRequired: 0,
            totalBill: 0,
        }
    });

    useEffect(() => {
        if (newPatientId) {
            router.push(`/dashboard/patients/${newPatientId}`);
        }
    }, [newPatientId, router]);

    const generateBillNumber = () => {
        const currentYear = new Date().getFullYear();
        const patientsFromThisYear = patients.filter(p => new Date(p.registrationDate).getFullYear() === currentYear);
        const nextId = patientsFromThisYear.length + 1;
        const paddedId = nextId.toString().padStart(3, '0');
        return `${currentYear}${paddedId}`;
    };

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const newPatient: Patient = {
            id: uuidv4(),
            email: "", // Not in form, but required by type
            ...data,
            billNumber: generateBillNumber(),
            treatmentPlan: data.treatmentPlan || "",
            medicines: data.medicines || "",
            registrationDate: new Date().toISOString(),
            sessions: [], // Initialize with no sessions
            payments: [], // Initialize with no payments
        };

        setPatients([newPatient, ...patients]);

        toast({
            title: "Patient Added",
            description: `${newPatient.name} has been added to your patient list.`,
        });

        setNewPatientId(newPatient.id);
    };

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Add New Patient</h1>
        </div>

        <Tabs defaultValue="details">
            <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attendance" disabled>Attendance</TabsTrigger>
                <TabsTrigger value="payments" disabled>Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" placeholder="John Doe" {...register("name")} />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" type="number" {...register("age")} />
                                    {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Mobile</Label>
                                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" {...register("phone")} />
                                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="diagnosis">Diagnosis</Label>
                                <Textarea id="diagnosis" placeholder="e.g., Lumbar Spondylosis" {...register("diagnosis")} />
                                {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="treatment-plan">Treatment</Label>
                                <Textarea id="treatment-plan" placeholder="Describe the treatment plan..." {...register("treatmentPlan")} />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="medicines">Medicines</Label>
                                <Textarea id="medicines" placeholder="Prescribed medicines..." {...register("medicines")} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sessionsRequired">Sessions Required</Label>
                                    <Input id="sessionsRequired" type="number" {...register("sessionsRequired")} />
                                    {errors.sessionsRequired && <p className="text-sm text-destructive">{errors.sessionsRequired.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="totalBill">Total Bill</Label>
                                    <Input id="totalBill" type="number" {...register("totalBill")} />
                                    {errors.totalBill && <p className="text-sm text-destructive">{errors.totalBill.message}</p>}
                                </div>
                            </div>
                            
                             <div className="space-y-2">
                                <Label htmlFor="consultantPhysio">Consultant Physio</Label>
                                <Input id="consultantPhysio" placeholder="Dr. Anil Kumar" {...register("consultantPhysio")} />
                                {errors.consultantPhysio && <p className="text-sm text-destructive">{errors.consultantPhysio.message}</p>}
                            </div>


                            <div className="flex justify-end gap-2 mt-8">
                                <Button type="button" variant="outline" onClick={() => router.push('/dashboard/patients')}>Close</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Patient"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}

    