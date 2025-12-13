import Hero from "@/components/sections/Hero";
import Treatments from "@/components/sections/Treatments";
import MissionVision from "@/components/sections/MissionVision";
import About from "@/components/sections/About";
import BlogPreview from "@/components/sections/BlogPreview";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Treatments />
      <MissionVision />
      <About />
      <BlogPreview />
      <Testimonials />
      <Cta />
    </>
  );
}
