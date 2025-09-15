import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import image from "../assets/publicperson.png"

const HeroSection = () => {
  const navigate = useNavigate();

  const heroVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-16 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={heroVariants} className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-poppins text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Find Part-Time Jobs That
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500"> Work for You</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Earnease helps students find flexible, verified jobs while allowing employers to hire smarter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                onClick={() => navigate("/job")}
              >
                Find Jobs
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </motion.button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Jobs</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Student-Friendly</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={heroVariants}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <img
              src={image}
              alt="Public person illustration"
              className="rounded-3xl shadow-2xl w-full h-auto object-cover"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;