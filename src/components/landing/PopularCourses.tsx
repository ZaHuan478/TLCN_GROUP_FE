import React, { useMemo, useState } from 'react';
import Title from '../atoms/Title/Title';
import CourseCard from '../molecules/CourseCard/CourseCard';
import { Input } from '../atoms/Input/Input';


const courses = [
	{
		title: 'Web Development',
		duration: '8 weeks',
		price: '$99',
		image: '/course1.jpg',
	},
	{
		title: 'UI/UX Design',
		duration: '6 weeks',
		price: '$89',
		image: '/course2.jpg',
	},
	{
		title: 'Mobile Development',
		duration: '10 weeks',
		price: '$129',
		image: '/course3.jpg',
	},
];

const PopularCourses: React.FC = () => {
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return courses;
		return courses.filter((c) => c.title.toLowerCase().includes(q));
	}, [query]);

	return (
		<section className="py-16 bg-amber-50">
			<div className="container mx-auto px-4">
				<Title level={2} className="text-center mb-6">
					Pick the most popular courses
				</Title>

				<div className="max-w-md mx-auto mb-8">
					<Input
						value={query}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setQuery(e.target.value)
						}
						placeholder="Search courses..."
						className="w-full"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{filtered.map((course, index) => (
						<CourseCard key={index} {...course} />
					))}
				</div>
			</div>
		</section>
	);
};

export default PopularCourses;