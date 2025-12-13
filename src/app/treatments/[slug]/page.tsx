import { treatments } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

type TreatmentPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
    return treatments.map((treatment) => ({
        slug: treatment.slug,
    }));
}

export function generateMetadata({ params }: TreatmentPageProps) {
    const treatment = treatments.find((t) => t.slug === params.slug);
    if (!treatment) {
        return {
            title: "Treatment Not Found"
        }
    }
    return {
        title: `${treatment.title} | ActivePlus Rehab`,
        description: `Learn about our ${treatment.title} services.`,
    };
}


export default function TreatmentPage({ params }: TreatmentPageProps) {
  const treatment = treatments.find((t) => t.slug === params.slug);

  if (!treatment) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
              <treatment.icon className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            {treatment.title}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
            {treatment.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {treatment.subTreatments.map((sub, index) => (
                <Card key={index} className="bg-secondary">
                    <CardContent className="p-6 flex items-center gap-4">
                        <Check className="w-6 h-6 text-primary flex-shrink-0" />
                        <h3 className="font-medium text-secondary-foreground">{sub}</h3>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
