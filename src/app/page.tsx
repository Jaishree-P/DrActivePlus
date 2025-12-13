import Hero from "@/components/sections/Hero";
import Treatments from "@/components/sections/Treatments";
import MissionVision from "@/components/sections/MissionVision";
import About from "@/components/sections/About";
import BlogPreview from "@/components/sections/BlogPreview";
import Testimonials from "@/components/sections/Testimonials";
import Cta from "@/components/sections/Cta";
import Stats from "@/components/sections/Stats";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="animate-fade-in-up animation-delay-200">
        <Stats />
      </div>
      <div className="animate-fade-in-up animation-delay-200">
        <Treatments />
      </div>
      <div className="animate-fade-in-up animation-delay-400">
        <MissionVision />
      </div>
      <div className="animate-fade-in-up animation-delay-600">
        <About />
      </div>
      <div className="animate-fade-in-up animation-delay-800">
        <BlogPreview />
      </div>
      <div className="animate-fade-in-up animation-delay-1000">
        <Testimonials />
      </div>
      <div className="animate-fade-in-up animation-delay-1200">
        <Cta />
      </div>
    </>
  );
}
