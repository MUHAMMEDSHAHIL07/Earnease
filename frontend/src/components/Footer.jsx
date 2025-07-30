import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-bold mb-4 text-2xl ">Earnease</h3>
          <p>Connecting students with part-time work opportunities that fit their lifestyle and goals.</p>
        </div>
        <div>
          <h3 className="font-bold mb-4 text-1xl">Quick Links</h3>
          <ul className="space-y-2">
            <li>Find Jobs</li>
            <li>Post a Job</li>
            <li>How It Works</li>
            <li>About</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>Contact</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Contact</h3>
          <p>support@earnease.com</p>
          <p>Calicut,Kerala</p>
        </div>
      </div>
      <div className="text-center mt-8 text-gray-400 text-xs">© 2025 Earnease. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
