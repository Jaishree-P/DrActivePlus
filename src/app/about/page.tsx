"use client";

import Image from "next/image";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type DoctorProfile } from "@/lib/types";
import { defaultDoctorProfile } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Award, GraduationCap, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  const [doctorProfile] = useLocalStorage<DoctorProfile>(
    "doctor-profile",
    defaultDoctorProfile
  );
  const doctorImage = PlaceHolderImages.find((img) => img.id === "doctor-photo");

  if (!doctorImage) return null;
  
  const DetailSection = ({ title, items, icon: Icon }: { title: string; items: string[]; icon: React.ComponentType<{className?: string}> }) => (
    <div className="mt-12">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-semibold">{title}</h3>
      </div>
      <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            About Dr. Anil Kumar
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            Our Commitment to Your Health and Recovery
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 flex flex-col items-center">
                 <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
                    <Image
                        src={doctorImage.imageUrl}
                        alt={doctorProfile.name}
                        fill
                        className="object-cover"
                        data-ai-hint={doctorImage.imageHint}
                    />
                </div>
                <h2 className="mt-6 text-3xl font-bold">{doctorProfile.name}</h2>
                <p className="text-lg text-muted-foreground">{doctorProfile.title}</p>
                 <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {doctorProfile.specializations.map((spec) => (
                        <Badge key={spec} variant="destructive">{spec}</Badge>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2">
                <p className="text-lg leading-8">{doctorProfile.bio}</p>

                <DetailSection title="Qualifications" items={doctorProfile.qualifications} icon={GraduationCap} />
                <DetailSection title="Specializations" items={doctorProfile.specializations} icon={ShieldCheck} />
                <DetailSection title="Certifications" items={doctorProfile.certifications} icon={Award} />
            </div>
        </div>
      </div>
    </div>
  );
}
