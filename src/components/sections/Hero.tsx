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
    <section className="bg-secondary">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16 md:py-24">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl">
              Advance Spine | Joint & Laser Center
            </h1>
            <p className="mt-6 max-w-3xl mx-auto md:mx-0 text-lg text-muted-foreground md:text-xl">
              Experience expert physiotherapy care with state-of-the-art technology. We are dedicated to your recovery and well-being.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <WhatsAppButton size="lg" />
              <Button variant="outline" size="lg" asChild>
                <Link href="/treatments/laser-therapy">Our Services</Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full h-80 md:h-full rounded-lg overflow-hidden shadow-2xl">
             <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover object-center"
                priority
                data-ai-hint={heroImage.imageHint}
              />
          </div>
        </div>
      </div>
    </section>
  );
}
