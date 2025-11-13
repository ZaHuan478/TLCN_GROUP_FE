import React from "react";
import Navbar from "../../organisms/Navbar/Navbar";
const MainTemplate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="text-[#1E1E1E] min-h-screen flex flex-col">
      <Navbar />
      <main className="bg-gray-100 flex-1">{children}</main>
    </div>
  );
};

export default MainTemplate;
