import React, { useEffect, useMemo, useState, useRef, ReactNode } from "react";
import { CourseCard, CourseCardProps } from "../../molecules/CourseCard";
import { Button } from "../../atoms/Button/Button";

type CourseCategory = "all" | "combo" | "fullcourse";

const categoryLabels: Record<CourseCategory, string> = {
	all: "All",
	combo: "Combo",
	fullcourse: "Full Course",
};

const categoryIcons: Record<CourseCategory, ReactNode> = {
	all: (
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<rect x="3" y="3" width="7" height="7"></rect>
			<rect x="14" y="3" width="7" height="7"></rect>
			<rect x="14" y="14" width="7" height="7"></rect>
			<rect x="3" y="14" width="7" height="7"></rect>
		</svg>
	),
	combo: (
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
		</svg>
	),
	fullcourse: (
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
			<polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
			<polyline points="2 17 12 22 22 17"></polyline>
			<polyline points="2 12 12 17 22 12"></polyline>
		</svg>
	),
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
	badgeText = "Courses",
	title = "Featured Courses",
	subtitle = "Discover the learning path that's right for you",
}) => {
	const [selectedCategory, setSelectedCategory] = useState<CourseCategory>("all");
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const categories: CourseCategory[] = useMemo(() => {
		const uniqueTypes = Array.from(
			new Set(courses.map((course) => course.type))
		).filter((type) => type !== "course") as CourseCategory[];

		// Only include categories that exist in the courses
		const availableCategories: CourseCategory[] = ["all"];
		if (uniqueTypes.includes("combo")) availableCategories.push("combo");
		if (uniqueTypes.includes("fullcourse")) availableCategories.push("fullcourse");

		return availableCategories;
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

	const checkScrollButtons = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	useEffect(() => {
		checkScrollButtons();
		const container = scrollContainerRef.current;
		if (container) {
			container.addEventListener('scroll', checkScrollButtons);
			return () => container.removeEventListener('scroll', checkScrollButtons);
		}
	}, [categories]);

	const scroll = (direction: 'left' | 'right') => {
		if (scrollContainerRef.current) {
			const scrollAmount = 200;
			scrollContainerRef.current.scrollBy({
				left: direction === 'left' ? -scrollAmount : scrollAmount,
				behavior: 'smooth'
			});
		}
	};

	return (
		<section className="w-full py-8">
			{/* Navigation with Titles */}
			<div className="mb-8">
				{/* Titles in Navigation */}
				<div className="mb-6">
					<div className="flex items-center gap-2 mb-2">
						<span className="text-xs font-bold uppercase text-yellow-600 tracking-wider">
							{badgeText}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-900">{title}</h2>
							<p className="text-sm text-gray-600 mt-1">{subtitle}</p>
						</div>
						<div className="text-sm text-gray-500">
							<span className="font-semibold text-gray-900">{filteredCourses.length}</span> courses
						</div>
					</div>
				</div>

				{/* Category Navigation */}
				{categories.length > 1 && (
					<div className="relative">
						{canScrollLeft && (
							<Button
								onClick={() => scroll('left')}
								variant="icon"
								className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200"
								aria-label="Scroll left"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="15 18 9 12 15 6"></polyline>
								</svg>
							</Button>
						)}

						<div
							ref={scrollContainerRef}
							className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-10"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
						>
							{categories.map((category) => {
								const isActive = selectedCategory === category;
								return (
									<Button
										key={category}
										onClick={() => setSelectedCategory(category)}
										variant={isActive ? "primary" : "outline"}
										className={`flex items-center gap-2 whitespace-nowrap transition-all ${isActive ? "shadow-sm" : ""
											}`}
									>
										{categoryIcons[category]}
										{categoryLabels[category]}
									</Button>
								);
							})}
						</div>

						{canScrollRight && (
							<Button
								onClick={() => scroll('right')}
								variant="icon"
								className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md border border-gray-200"
								aria-label="Scroll right"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
									<polyline points="9 18 15 12 9 6"></polyline>
								</svg>
							</Button>
						)}
					</div>
				)}
			</div>

			{/* Centered Courses Grid */}
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
					{loading ? (
						<div className="col-span-full flex justify-center py-16">
							<div className="flex flex-col items-center gap-3">
								<div className="h-10 w-10 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
								<p className="text-sm text-gray-500">Loading courses...</p>
							</div>
						</div>
					) : filteredCourses.length > 0 ? (
						filteredCourses.map((course) => (
							<CourseCard key={course.id} {...course} />
						))
					) : (
						<div className="col-span-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
							<div className="flex flex-col items-center gap-2">
								<div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
										<circle cx="11" cy="11" r="8"></circle>
										<path d="m21 21-4.35-4.35"></path>
									</svg>
								</div>
								<p className="text-gray-600 font-medium">No courses found</p>
								<p className="text-sm text-gray-500">Try selecting a different category</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};
