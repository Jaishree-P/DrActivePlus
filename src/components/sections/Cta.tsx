import WhatsAppButton from "../WhatsAppButton";

export default function Cta() {
  return (
    <section className="bg-primary">
      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
            Ready to Take the First Step?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Your journey to a pain-free life starts here. Contact us today to schedule your consultation.
          </p>
          <div className="mt-8">
            <WhatsAppButton size="lg" variant="secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
