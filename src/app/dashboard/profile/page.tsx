"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type DoctorProfile } from "@/lib/types";
import { defaultDoctorProfile } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useActivityLog } from "@/hooks/use-activity-log";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  title: z.string().min(2, "Title is required"),
  bio: z.string().min(20, "Bio should be at least 20 characters"),
  qualifications: z.string().min(2, "Qualifications are required"),
  specializations: z.string().min(2, "Specializations are required"),
  certifications: z.string().min(2, "Certifications are required"),
});

type FormValues = {
  name: string;
  title: string;
  bio: string;
  qualifications: string;
  specializations: string;
  certifications: string;
};

export default function DoctorProfilePage() {
  const [doctorProfile, setDoctorProfile] = useLocalStorage<DoctorProfile>(
    "doctor-profile",
    defaultDoctorProfile
  );
  const { toast } = useToast();
  const { logActivity } = useActivityLog();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...doctorProfile,
      qualifications: doctorProfile.qualifications.join(", "),
      specializations: doctorProfile.specializations.join(", "),
      certifications: doctorProfile.certifications.join(", "),
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const updatedProfile: DoctorProfile = {
      ...data,
      qualifications: data.qualifications.split(",").map(s => s.trim()),
      specializations: data.specializations.split(",").map(s => s.trim()),
      certifications: data.certifications.split(",").map(s => s.trim()),
    };
    setDoctorProfile(updatedProfile);
    logActivity("Updated Profile", `Doctor profile for ${data.name} was updated.`);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully saved.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Doctor Profile</CardTitle>
        <CardDescription>
          Edit your professional information. Changes will be reflected on the public website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name")} />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} />
                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>
            </div>
          
            <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea id="bio" {...register("bio")} rows={5} />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
                <Input id="qualifications" {...register("qualifications")} />
                {errors.qualifications && <p className="text-sm text-destructive">{errors.qualifications.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                <Input id="specializations" {...register("specializations")} />
                {errors.specializations && <p className="text-sm text-destructive">{errors.specializations.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                <Input id="certifications" {...register("certifications")} />
                {errors.certifications && <p className="text-sm text-destructive">{errors.certifications.message}</p>}
            </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
