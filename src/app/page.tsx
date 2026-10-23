import FrameScrubber from "@/components/FrameScrubber";
import FencingOptions from "@/components/FencingOptions";
import ShowcaseScrubber from "@/components/ShowcaseScrubber";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import EstimateForm from "@/components/EstimateForm";

export default function Home() {
  return (
    <main>
      {/* Scroll-driven hero animation */}
      <FrameScrubber />

      {/* Fencing options explorer */}
      <FencingOptions />

      {/* Second cinematic scroll sequence */}
      <ShowcaseScrubber />

      {/* Before & after drag-to-reveal */}
      <BeforeAfterSection />

      {/* Why choose us */}
      <WhyChooseUs />

      {/* Customer testimonials */}
      <Testimonials />

      {/* Inquiry form — id="estimate" anchor for all CTA links */}
      <EstimateForm />
    </main>
  );
}
