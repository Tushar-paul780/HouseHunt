import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import Locations from "../components/Locations";
import WhyChooseUs from "../components/WhyChooseUs";
import Agents from "../components/Agents";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <FeaturedProperties />
      <Locations />
      <WhyChooseUs />
      <Agents />
      <CTA />
      <Footer />
    </div>
  );
}
