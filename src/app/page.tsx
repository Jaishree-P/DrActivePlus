import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MissionVision from "@/components/sections/MissionVision";
import Treatments from "@/components/sections/Treatments";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Testimonials from "@/components/sections/Testimonials";
import BlogPreview from "@/components/sections/BlogPreview";
import Cta from "@/components/sections/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <MissionVision />
      <Treatments />
      <WhyChooseUs />
      <Testimonials />
      <BlogPreview />
      <Cta />
    </>
  );
}
