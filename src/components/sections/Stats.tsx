import { Award, HeartHandshake, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    icon: HeartHandshake,
    value: "20000+",
    label: "Trusted Patients",
  },
  {
    icon: Award,
    value: "20+",
    label: "Years Experience",
  },
  {
    icon: ShieldCheck,
    value: "20000+",
    label: "Successfully Treated",
  },
];

export default function Stats() {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-secondary">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <stat.icon className="w-8 h-8 text-primary mb-2" />
                    <p className="text-xl md:text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1 leading-tight">{stat.label}</p>
                </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
