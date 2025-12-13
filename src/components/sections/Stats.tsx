import { Award, HeartHandshake, ShieldCheck } from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-center gap-4">
              <stat.icon className="w-10 h-10 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
