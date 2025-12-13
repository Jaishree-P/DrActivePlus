import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";
import WhatsAppButton from "../WhatsAppButton";
import Stats from "./Stats";

export default function Hero() {
  const heroImage = PlaceHolderImages.find(
    (img) => img.id === "hero-background"
  );

  if (!heroImage) return null;

  return (
    <section className="relative w-full h-screen">
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover object-center"
          priority
          data-ai-hint={heroImage.imageHint}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4">
          <div className="container mx-auto flex flex-col h-full justify-center text-center text-white">
            <div className="flex-grow flex flex-col justify-center items-center">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Advance Spine | Joint & Laser Center
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-200 md:text-xl">
                Experience expert physiotherapy care with state-of-the-art technology. We are dedicated to your recovery and well-being.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <WhatsAppButton size="lg" />
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/treatments/laser-therapy">Our Services</Link>
                </Button>
              </div>
            </div>
            <div className="pb-8 md:pb-12 w-full">
              <Stats />
            </div>
          </div>
        </div>
    </section>
  );
}
