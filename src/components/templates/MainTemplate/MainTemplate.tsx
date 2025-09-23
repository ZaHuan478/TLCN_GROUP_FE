import React from "react";
import Navbar from "../../organisms/Navbar/Navbar";
import Footer from "../../organisms/Footer/Footer";

const MainTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-[#FFF0D9] text-[#1E1E1E]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainTemplate;
