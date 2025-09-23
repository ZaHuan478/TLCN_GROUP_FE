import React from "react";
import Heading from "../../atoms/Heading/Heading";

const cats = [
  { 
    label: "Design sector",
    courses: "123 Courses",
    colors: "bg-blue-500 bg-yellow-400"
  },
  { 
    label: "Development sector",
    courses: "123 Courses", 
    colors: "bg-red-500 bg-blue-500 bg-yellow-400"
  },
  { 
    label: "Marketing sector",
    courses: "123 Courses",
    colors: "bg-red-500 bg-blue-500"
  },
  { 
    label: "Others sector",
    courses: "123 Courses",
    colors: "bg-red-500 bg-blue-500 bg-yellow-400"
  },
];

const Categories: React.FC = () => {
  return (
    <section className="px-4 sm:px-10 py-16 bg-white flex justify-center">
      <div className="w-[1170px] h-[625px] flex">
        <div className="flex-1">
          <Heading
            level={2}
            style={{ fontFamily: 'Neurial Grotesk' }}
          >
            Explore courses by <br />category
          </Heading>
          
          <div className="mt-8">
            <img className="rounded-lg w-[470px] h-[478px] object-cover" src="https://storage.googleapis.com/a1aa/image/a8b72e6f-e13c-49e1-337d-d6a55d85a174.jpg" alt="category" />
          </div>
        </div>

        <div className="flex-1 pl-16">
          <p className="text-[#6B7280] text-base mb-12 max-w-md">
            You learn today and earn tomorrow. The roots of education are bitter but the fruits are sweet. If you learn today you can lead tomorrow. Explore the best categories.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            {cats.map((c, index) => (
              <div key={c.label} className="flex flex-col p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-300 cursor-pointer w-[270px] h-[224px]">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4 relative overflow-hidden">
                    {index === 0 && (
                      <>
                        <div className="w-6 h-6 bg-blue-500 rounded-full absolute top-1 right-1"></div>
                        <div className="w-4 h-4 bg-yellow-400 absolute bottom-1 left-1"></div>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <div className="w-4 h-4 bg-red-500 absolute top-1 right-1 transform rotate-45"></div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full absolute bottom-1 right-1"></div>
                        <div className="w-4 h-4 bg-yellow-400 absolute bottom-1 left-1"></div>
                      </>
                    )}
                    {index === 2 && (
                      <>
                        <div className="w-4 h-4 bg-red-500 absolute top-1 left-1 transform rotate-45"></div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full absolute bottom-2 right-2"></div>
                      </>
                    )}
                    {index === 3 && (
                      <>
                        <div className="w-4 h-4 bg-red-500 absolute top-1 right-1 transform rotate-45"></div>
                        <div className="w-6 h-6 bg-blue-500 rounded-full absolute bottom-1 right-1"></div>
                        <div className="w-4 h-4 bg-yellow-400 absolute bottom-1 left-1"></div>
                      </>
                    )}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-black mb-2">{c.label}</h3>
                <p className="text-[#6B7280] text-sm">{c.courses}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;

