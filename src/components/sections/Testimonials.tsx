"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const getAvatar = (id: string) => {
    const img = PlaceHolderImages.find((p) => p.id === id);
    return img ? img.imageUrl : "";
  };

  const getAvatarHint = (id: string) => {
    const img = PlaceHolderImages.find((p) => p.id === id);
    return img ? img.imageHint : "";
  };
  
  return (
    <section className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            What Our Patients Say
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Real stories from people we've helped on their path to recovery.
          </p>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col">
                    <CardContent className="flex-grow flex flex-col justify-between p-6">
                      <Quote className="w-8 h-8 text-primary/50 mb-4" />
                      <p className="text-muted-foreground flex-grow mb-6">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage 
                            src={getAvatar(testimonial.avatar)} 
                            alt={testimonial.name} 
                            data-ai-hint={getAvatarHint(testimonial.avatar)}
                            />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
