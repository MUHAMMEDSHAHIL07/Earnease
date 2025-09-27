import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#0a0a0a] text-white py-10 px-5 md:px-20 mt-20"
    >
      <div className="block md:hidden text-center">
        <h1 className="text-3xl font-bold text-blue-500">Earnease</h1>
        <p className="mt-4 text-sm text-gray-400">
          Connecting students with part-time work opportunities that fit their lifestyle and goals.
        </p>
        <div className="flex mt-4 space-x-4 justify-center">
          <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
          <FaInstagram className="hover:text-pink-500 cursor-pointer" />
          <FaLinkedinIn className="hover:text-blue-300 cursor-pointer" />
          <FaTwitter className="hover:text-sky-400 cursor-pointer" />
        </div>
      </div>

      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-500">Earnease</h1>
          <p className="mt-4 text-sm text-gray-400">
            Connecting students with part-time work opportunities that fit their lifestyle and goals.
          </p>
          <div className="flex mt-4 space-x-4">
            <FaFacebookF className="hover:text-blue-500 cursor-pointer" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer" />
            <FaLinkedinIn className="hover:text-blue-300 cursor-pointer" />
            <FaTwitter className="hover:text-sky-400 cursor-pointer" />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Services</li>
            <li className="hover:text-white cursor-pointer">Workshops</li>
            <li className="hover:text-white cursor-pointer">About Us</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="hover:text-white cursor-pointer">FAQs</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
            <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
            <li className="hover:text-white cursor-pointer">Help Center</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-300">Contact</h3>
          <p className="text-sm text-gray-400">support@earnease.in</p>
          <p className="text-sm text-gray-400 mt-2">+91 7012949560</p>
          <p className="text-sm text-gray-400 mt-2">Calicut, Kerala, India</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Earnease. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;