import { motion } from "framer-motion";
import { Briefcase,MapPin ,Clock  } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturedJobs = () => {

  const navigate = useNavigate()
  const jobs = [
    {
      title: "Campus Tour Guide",
      company: "University Services",
      location: "On Campus",
      type: "Part-time",
      pay: "$15/hr",
      tags: ["Flexible", "No Experience"],
    },
    {
      title: "Social Media Assistant",
      company: "Local Marketing Co.",
      location: "Remote",
      type: "Part-time",
      pay: "$18/hr",
      tags: ["Creative", "Remote"],
    },
    {
      title: "Tutoring Assistant",
      company: "Learning Center",
      location: "Near Campus",
      type: "Part-time",
      pay: "$20/hr",
      tags: ["Education", "Rewarding"],
    },
    {
      title: "Barista",
      company: "Campus Coffee",
      location: "Student Union",
      type: "Part-time",
      pay: "$14/hr",
      tags: ["Food Service", "Tips"],
    },
  ];

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
          <p className="text-xl text-gray-600">Hand-picked jobs perfect for students</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-bold text-green-600">{job.pay}</span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-3">{job.company}</p>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
                <Clock className="w-4 h-4 ml-3 mr-1" />
                {job.type}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all"
            onClick={() => navigate("/job")}
          >
            View All Jobs
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};
export default FeaturedJobs