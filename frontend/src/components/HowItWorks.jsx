import { motion } from "framer-motion";
import { Users, Briefcase, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, ease: "easeOut" },
    }),
  };

  const heroVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const steps = [
    {
      icon: Users,
      title: "1. Create Your Profile",
      text: "Set up your profile with skills, availability, and preferences. Get verified in minutes.",
      gradient: "from-blue-600 to-blue-700",
    },
    {
      icon: Briefcase,
      title: "2. Apply or Post Jobs",
      text: "Students apply to perfect matches. Employers post jobs and review applications easily.",
      gradient: "from-teal-500 to-teal-600",
    },
    {
      icon: CheckCircle,
      title: "3. Start Working & Get Paid",
      text: "Begin your job and receive secure payments. Track hours and build your reputation.",
      gradient: "from-green-500 to-green-600",
    },
  ];

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="py-20 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={heroVariants} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Whether you're a student or employer, we've streamlined the process.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center group hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
export default HowItWorks