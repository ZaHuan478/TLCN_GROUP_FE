import React from "react";
import NavLinks from "../../molecules/NavLinks/NavLinks";
import { Link } from "react-router-dom";
import { Button } from "../../atoms/Button/Button";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-4 sm:px-10 py-4 bg-[#FFF0D9] border-b border-[#F3D94B]">
      <NavLinks />

      <div className="hidden md:block">
        <div className="w-[102px] h-[44px] rounded-[4px] border border-gray-300 flex items-center justify-center">
          <Link to="/signin" className="w-full h-full">
            <Button
              variant="secondary"
              className="w-full h-full rounded-[4px] flex items-center justify-center bg-black text-white font-bold font-[700] leading-[28px] hover:bg-yellow-400 hover:text-black transition-colors"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
