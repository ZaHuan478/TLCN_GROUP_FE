import React, { useEffect, useMemo, useState } from "react";
import { CourseCard, CourseCardProps } from "../../molecules/CourseCard";

type CourseCategory = "all" | "course" | "combo" | "fullcourse";

const categoryLabels: Record<CourseCategory, string> = {
	all: "Tất cả",
	course: "Khóa học",
	combo: "Combo",
	fullcourse: "Full Course",
};

type CourseSectionProps = {
	courses: CourseCardProps[];
	loading?: boolean;
	badgeText?: string;
	title?: string;
	subtitle?: string;
};

export const CourseSection: React.FC<CourseSectionProps> = ({
	courses,
	loading = false,
	badgeText = "CodeLearn Courses",
	title = "Khóa học nổi bật",
	subtitle = "Khám phá lộ trình học tập phù hợp với bạn",
}) => {
	const [selectedCategory, setSelectedCategory] =
		useState<CourseCategory>("all");

	const categories: CourseCategory[] = useMemo(() => {
		const uniqueTypes = Array.from(
			new Set(courses.map((course) => course.type))
		) as CourseCategory[];
		return ["all", ...uniqueTypes];
	}, [courses]);

	useEffect(() => {
		if (!categories.includes(selectedCategory)) {
			setSelectedCategory("all");
		}
	}, [categories, selectedCategory]);

	const filteredCourses = useMemo(() => {
		return courses.filter((course) => {
			return selectedCategory === "all" || course.type === selectedCategory;
		});
	}, [courses, selectedCategory]);

	return (
		<section className="w-full space-y-6 py-8">
			<div className="mx-auto w-full max-w-7xl px-4">
				<header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-sm font-semibold uppercase text-yellow-500">
							{badgeText}
						</p>
						<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
						<p className="text-sm text-gray-500">{subtitle}</p>
					</div>
				</header>
			</div>

			<div className="mx-auto w-full max-w-7xl px-4">
				<div className="flex gap-3 overflow-x-auto pb-2">
					{categories.map((category) => {
						const isActive = selectedCategory === category;
						return (
							<button
								key={category}
								type="button"
								onClick={() => setSelectedCategory(category)}
								className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
									isActive
										? "border-yellow-400 bg-yellow-50 text-yellow-600 shadow-sm"
										: "border-gray-200 bg-white text-gray-600 hover:border-yellow-300 hover:text-yellow-500"
								}`}
							>
								{categoryLabels[category]}
							</button>
						);
					})}
				</div>
			</div>

			<div className="mx-auto w-full max-w-7xl px-4">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{loading ? (
						<div className="col-span-full flex justify-center py-10">
							<div className="h-12 w-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
						</div>
					) : filteredCourses.length > 0 ? (
						filteredCourses.map((course) => (
							<CourseCard key={course.id} {...course} />
						))
					) : (
						<div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white p-6 text-center text-gray-500">
							Không tìm thấy khóa học phù hợp.
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
