import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFF0D9] text-[#1E1E1E] py-10 px-4 sm:px-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-0">
        <div className="flex flex-col space-y-4 md:w-1/4">
          <h4 className="font-bold">Courses</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-yellow-400" href="#">Accounting</a></li>
            <li><a className="hover:text-yellow-400" href="#">Design</a></li>
            <li><a className="hover:text-yellow-400" href="#">Development</a></li>
            <li><a className="hover:text-yellow-400" href="#">Marketing</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 md:w-1/4">
          <h4 className="font-bold">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-yellow-400" href="#">Business</a></li>
            <li><a className="hover:text-yellow-400" href="#">Health</a></li>
            <li><a className="hover:text-yellow-400" href="#">Technology</a></li>
            <li><a className="hover:text-yellow-400" href="#">Lifestyle</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 md:w-1/4">
          <h4 className="font-bold">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-yellow-400" href="#">Support</a></li>
            <li><a className="hover:text-yellow-400" href="#">FAQs</a></li>
            <li><a className="hover:text-yellow-400" href="#">Contact Us</a></li>
          </ul>
        </div>

        <div className="flex flex-col space-y-4 md:w-1/4">
          <h4 className="font-bold">Contact</h4>
          <p className="text-sm">email@knowledge.com</p>
          <p className="text-sm">+001 123 456 789</p>
          <div className="flex space-x-4 text-xl">
            <a aria-label="Facebook" className="hover:text-yellow-400" href="#"><i className="fab fa-facebook-f" /></a>
            <a aria-label="Twitter" className="hover:text-yellow-400" href="#"><i className="fab fa-twitter" /></a>
            <a aria-label="Instagram" className="hover:text-yellow-400" href="#"><i className="fab fa-instagram" /></a>
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-300 pt-4 text-center text-xs text-gray-500">
        © 2024 Knowledge. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
