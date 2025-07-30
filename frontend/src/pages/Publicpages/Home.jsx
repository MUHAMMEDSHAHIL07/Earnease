import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";
import HowItWorks  from "../../components/HowItWorks";
import FeaturedJobs from "../../components/FeaturedJob";
import Testimonials from "../../components/Testimonials";


const Homepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <FeaturedJobs />
      <Testimonials />
      <Footer />
    </div>
  );
};
export default Homepage;