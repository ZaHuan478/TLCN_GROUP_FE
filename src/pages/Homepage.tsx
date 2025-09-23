import React from "react";
import MainTemplate from "../components/templates/MainTemplate/MainTemplate";
import Hero from "../components/organisms/Hero/Hero";
import Solutions from "../components/organisms/Solutions/Solutions";
import Categories from "../components/organisms/Categories/Categories";
import PopularCourses from "../components/organisms/PopularCourses/PopularCourses";
import Testimonials from "../components/organisms/Testimonials/Testimonials";
import Subscribe from "../components/organisms/Subscribe/Subscribe";

const Homepage: React.FC = () => {
  return (
    <MainTemplate>
      <Hero />
      <Solutions />
      <Categories />
      <PopularCourses />
      <Testimonials />
      <Subscribe />
    </MainTemplate>
  );
};

export default Homepage;
