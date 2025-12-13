"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Patient } from "@/lib/types";
import { defaultPatients } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  treatmentPlan: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewPatientPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [patients, setPatients] = useLocalStorage<Patient[]>("patients", defaultPatients);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        const newPatient: Patient = {
            id: uuidv4(),
            ...data,
            treatmentPlan: data.treatmentPlan || "",
            prescribedExercises: "", // Initialize as empty
            registrationDate: new Date().toISOString(),
            sessions: [], // Initialize with no sessions
        };

        setPatients([newPatient, ...patients]);

        toast({
            title: "Patient Added",
            description: `${newPatient.name} has been added to your patient list.`,
        });

        router.push("/dashboard/patients");
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Add New Patient</CardTitle>
        <CardDescription>
          Fill in the details to create a new patient record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" {...register("phone")} />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input id="diagnosis" placeholder="e.g., Lumbar Spondylosis" {...register("diagnosis")} />
                {errors.diagnosis && <p className="text-sm text-destructive">{errors.diagnosis.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="treatment-plan">Treatment Plan</Label>
                <Textarea id="treatment-plan" placeholder="Describe the treatment plan..." {...register("treatmentPlan")} />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild><Link href="/dashboard/patients">Cancel</Link></Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Patient"}
                </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
