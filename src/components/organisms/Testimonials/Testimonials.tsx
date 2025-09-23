import React from "react";

const items = [
	{
		text: "The courses are very well structured and easy to follow. I learned a lot!",
		name: "John Smith",
		avatar: "https://storage.googleapis.com/a1aa/image/1465423c-e547-476f-d69e-f5fa04d20c1a.jpg",
	},
	{
		text: "Great instructors and flexible learning schedule. Highly recommend!",
		name: "Valeriya Smith",
		avatar: "https://storage.googleapis.com/a1aa/image/174c073a-5e31-4dc0-213e-7b6a1f073cb1.jpg",
	},
	{
		text: "The best platform to learn new skills and advance your career.",
		name: "Claudia Smith",
		avatar: "https://storage.googleapis.com/a1aa/image/04abf325-b0e4-41b6-2d6f-81fbd3f77c37.jpg",
	},
];

const Testimonials: React.FC = () => {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-10 py-16 bg-white">
			<h3 className="font-bold text-lg mb-6">
				What our students are saying about us
			</h3>
			<p className="text-sm text-[#4B4B4B] max-w-3xl mb-10">
				Our students love the courses and the learning experience. Here are some
				of their testimonials.
			</p>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
				{items.map((t) => (
					<div
						key={t.name}
						className="border border-gray-200 rounded-lg p-6 flex flex-col"
					>
						<p className="text-sm text-[#4B4B4B] flex-grow">"{t.text}"</p>
						<div className="mt-4 flex items-center space-x-3">
							<img
								className="rounded-full w-10 h-10 object-cover"
								src={t.avatar}
								alt={t.name}
							/>
							<div>
								<p className="font-semibold text-sm">{t.name}</p>
								<p className="text-xs text-gray-400">Student</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Testimonials;
