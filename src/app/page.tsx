import Hero from "@/components/sections/Hero";
import Treatments from "@/components/sections/Treatments";
import MissionVision from "@/components/sections/MissionVision";
import About from "@/components/sections/About";
import BlogPreview from "@/components/sections/BlogPreview";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";
import Stats from "@/components/sections/Stats";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollAnimation>
        <Stats />
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <Treatments />
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <MissionVision />
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <About />
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <BlogPreview />
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <Testimonials />
      </ScrollAnimation>
      <ScrollAnimation delay={200}>
        <Cta />
      </ScrollAnimation>
    </>
  );
}
