import { Quote } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="text-center p-8 border border-border rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <Quote className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              Our Mission
            </h2>
            <p className="mt-4 text-lg italic text-muted-foreground">
              "To provide compassionate, evidence-based physiotherapy to restore function, alleviate pain, and enhance the quality of life for every patient."
            </p>
          </div>
          <div className="text-center p-8 border border-border rounded-lg shadow-sm">
            <div className="flex justify-center mb-4">
              <Quote className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-primary">
              Our Vision
            </h2>
            <p className="mt-4 text-lg italic text-muted-foreground">
              "To be the leading physiotherapy center recognized for clinical excellence, innovation, and a patient-centered approach to healthcare."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
