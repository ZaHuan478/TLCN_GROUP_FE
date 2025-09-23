import React from "react";
import Title from "../../atoms/Title/Title";
import { Button } from "../../atoms/Button/Button";

interface CourseCardProps {
  title: string;
  duration: string;
  price: string;
  image: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, duration, price, image }) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={title} className="w-full h-44 object-cover" />
      <div className="p-4">
        <Title level={3} className="mb-2">{title}</Title>
        <p className="text-sm text-gray-600 mb-4">{duration}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-blue-600">{price}</span>
          <Button variant="primary" className="text-sm">Enroll</Button>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
