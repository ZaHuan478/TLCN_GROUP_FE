import React from "react";

const data = [
  {
    title: "Accounting Basics",
    desc: "Learn the fundamentals of accounting.",
    price: "$99",
    img: "https://storage.googleapis.com/a1aa/image/3e0d7b6d-cdbc-4c19-c56c-bd5dd648a7cf.jpg",
  },
  {
    title: "Graphic Design",
    desc: "Master the art of visual communication.",
    price: "$124",
    img: "https://storage.googleapis.com/a1aa/image/0792d06c-b99a-4843-5361-b653f7f5078d.jpg",
  },
  {
    title: "Business Management",
    desc: "Learn to manage and grow your business.",
    price: "$79",
    img: "https://storage.googleapis.com/a1aa/image/c64258ea-f044-4c97-ee9e-6abc97d33363.jpg",
  },
  {
    title: "Nutrition & Wellness",
    desc: "Improve your health and lifestyle.",
    price: "$89",
    img: "https://storage.googleapis.com/a1aa/image/20d4cb05-61f7-4e4e-090d-3a28cae54d4b.jpg",
  },
  {
    title: "Project Management",
    desc: "Manage projects efficiently and effectively.",
    price: "$99",
    img: "https://storage.googleapis.com/a1aa/image/942944eb-7298-4129-7f23-64f34185c353.jpg",
  },
  {
    title: "Creative Writing",
    desc: "Enhance your writing skills and creativity.",
    price: "$69",
    img: "https://storage.googleapis.com/a1aa/image/ce2f28f0-bfce-4b61-1ab7-674e1e9b171c.jpg",
  },
];

const PopularCourses: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-10 py-16 bg-[#FFF0D9]">
      <h3 className="font-bold text-center text-lg mb-6">Pick the most popular courses</h3>
      <p className="text-center text-sm text-[#4B4B4B] max-w-xl mx-auto mb-10">
        We have the best courses for you to learn and grow your skills.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {data.map((c) => (
          <div key={c.title} className="bg-white rounded-lg shadow p-4 flex flex-col">
            <img alt={c.title} className="rounded-lg mb-3 object-cover w-full h-44" src={c.img} />
            <h4 className="font-semibold text-sm mb-1">{c.title}</h4>
            <p className="text-xs text-[#4B4B4B] mb-2">{c.desc}</p>
            <div className="flex justify-between items-center mt-auto">
              <span className="font-bold text-sm">{c.price}</span>
              <button className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded">Enroll</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded shadow">View All Courses</button>
      </div>
    </section>
  );
};

export default PopularCourses;
