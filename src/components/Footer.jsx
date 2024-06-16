import React from 'react';
import { FaLinkedin, FaUserAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-blue-500 p-4 text-white mt-auto absolute bottom-0 w-full left-0 text-center z-50">
      <div className="container mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div>&copy; {new Date().getFullYear()} Drone Simulator. All rights reserved.</div>
        <div className="flex xsm:space-x-4 xsm:flex-row flex-col">
          <a href="https://www.linkedin.com/in/deepanshu-kewalramani/" className="text-white hover:text-gray-200 flex items-center" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="mr-2" /> LinkedIn
          </a>
          <a href="https://deepanshu--portfolio.vercel.app/" className="text-white hover:text-gray-200 flex items-center" target="_blank" rel="noopener noreferrer">
            <FaUserAlt className="mr-2" /> Portfolio
          </a>
          <a href="mailto:deepanshu.kewalramani2@gmail.com" className="text-white hover:text-gray-200 flex items-center">
            <MdEmail className="mr-2" /> Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
