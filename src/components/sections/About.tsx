"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type DoctorProfile } from "@/lib/types";
import { defaultDoctorProfile } from "@/lib/data";
import { Badge } from "../ui/badge";

export default function About() {
  const [doctorProfile] = useLocalStorage<DoctorProfile>(
    "doctor-profile",
    defaultDoctorProfile
  );
  const doctorImage = PlaceHolderImages.find((img) => img.id === "doctor-photo");

  if (!doctorImage) return null;

  return (
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-1 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl">
              <Image
                src={doctorImage.imageUrl}
                alt={doctorProfile.name}
                fill
                className="object-cover"
                data-ai-hint={doctorImage.imageHint}
              />
            </div>
          </div>
          <div className="md:col-span-2 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              Meet Our Expert
            </h2>
            <h3 className="mt-2 text-2xl font-semibold">
              {doctorProfile.name}
            </h3>
            <p className="text-lg text-muted-foreground">{doctorProfile.title}</p>
            <p className="mt-4 text-base leading-7">
              {doctorProfile.bio.substring(0, 250)}...
            </p>
            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-2">
              {doctorProfile.specializations.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="destructive">{spec}</Badge>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild>
                <Link href="/about">Read More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
