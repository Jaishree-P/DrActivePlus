"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials as defaultTestimonials } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Quote, Edit } from "lucide-react";
import NewReviewDialog from "../reviews/NewReviewDialog";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { type Testimonial } from "@/lib/types";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useLocalStorage<Testimonial[]>(
    "testimonials",
    defaultTestimonials
  );
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleReviewCreated = (newReview: Testimonial) => {
    setTestimonials([newReview, ...testimonials]);
    setDialogOpen(false);
  };

  const getAvatar = (id: string) => {
    const img = PlaceHolderImages.find((p) => p.id === id);
    return img ? img.imageUrl : `https://picsum.photos/seed/${id}/100/100`;
  };

  const getAvatarHint = (id: string) => {
    const img = PlaceHolderImages.find((p) => p.id === id);
    return img ? img.imageHint : "person portrait";
  };
  
  return (
    <section id="reviews" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              What Our Patients Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Real stories from people we've helped on their path to recovery.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
             <NewReviewDialog 
              isOpen={isDialogOpen} 
              setIsOpen={setDialogOpen}
              onReviewCreated={handleReviewCreated}
            />
          </div>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: testimonials.length > 2,
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
