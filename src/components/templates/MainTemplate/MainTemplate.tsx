import React from "react";
import Navbar from "../../organisms/Navbar/Navbar";
const MainTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="text-[#1E1E1E]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default MainTemplate;
