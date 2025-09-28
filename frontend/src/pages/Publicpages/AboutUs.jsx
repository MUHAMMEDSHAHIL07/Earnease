import { motion } from "framer-motion";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const AboutUs = () => {
  const cards = [
    {
      title: "Our Mission",
      desc: "To empower students with flexible jobs that boost financial independence and real world skills.",
    },
    {
      title: "Our Vision",
      desc: "To be the No.1 trusted platform for students seeking meaningful earning opportunities worldwide.",
    },
    {
      title: "Our Values",
      desc: "Integrity, growth, and collaboration guiding every opportunity we create for students and employers.",
    },
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-800">

        <section className="text-center py-20 px-6">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
          >
            About <span className="text-indigo-600">Earnease</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 50, damping: 15 }}
          >
            Helping students{" "}
            <span className="font-semibold text-indigo-500">earn while they learn</span>.{" "}
            Earnease bridges the gap between students and part-time opportunities, 
            empowering them with income, skills, and real-world experience.
          </motion.p>
        </section>


        <motion.section
          className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 px-6 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {cards.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "spring", stiffness: 60, damping: 15 },
                },
              }}
              className="rounded-2xl shadow-lg hover:shadow-2xl transition p-8 bg-white border-t-4 border-indigo-500"
            >
              <h3 className="text-2xl font-bold text-indigo-600 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>
      </div>
      <Footer />
    </>
  )
}

export default AboutUs