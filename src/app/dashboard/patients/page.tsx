import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import PatientsTable from "@/components/dashboard/PatientsTable";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Patients</h1>
        <Button asChild>
          <Link href="/dashboard/patients/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Patient
          </Link>
        </Button>
      </div>
      
      {/* The PatientsTable will be a client component handling local storage data */}
      <PatientsTable />
    </div>
  );
}
