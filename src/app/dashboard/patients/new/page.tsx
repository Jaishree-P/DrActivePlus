import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

// This will be a client component with react-hook-form
export default function NewPatientPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Add New Patient</CardTitle>
        <CardDescription>
          Fill in the details to create a new patient record.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input id="diagnosis" placeholder="e.g., Lumbar Spondylosis" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="treatment-plan">Treatment Plan</Label>
                <Textarea id="treatment-plan" placeholder="Describe the treatment plan..." />
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="outline" asChild><Link href="/dashboard/patients">Cancel</Link></Button>
                <Button>Save Patient</Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}
