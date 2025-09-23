import React, { useState } from "react";
import Heading from "../../atoms/Heading/Heading";

const features = [
	{
		title: "Recorded Class",
		desc: "Recorded class gives you more flexibility to learn faster.",
		content: {
			title: "Recorded class gives you more flexibility to learn faster.",
			description:
				"You learn today and earn tomorrow. The roots of education are bitter but the fruits are sweet. If you learn today you can lead tomorrow.",
			image:
				"https://storage.googleapis.com/a1aa/image/10db439f-dd00-49bd-5b26-8c8248d5089b.jpg",
		},
	},
	{
		title: "Live Class",
		desc: "Join live classes and interact with instructors in real-time.",
		content: {
			title: "Live class provides real-time interaction with instructors.",
			description:
				"Experience interactive learning with live sessions, ask questions instantly, and get immediate feedback from expert instructors.",
			image:
				"https://storage.googleapis.com/a1aa/image/10db439f-dd00-49bd-5b26-8c8248d5089b.jpg",
		},
	},
	{
		title: "Lifetime support",
		desc: "Get lifetime support and access to all course materials.",
		content: {
			title: "Lifetime support ensures continuous learning journey.",
			description:
				"Access course materials forever, get ongoing support, and stay updated with new content throughout your learning journey.",
			image:
				"https://storage.googleapis.com/a1aa/image/10db439f-dd00-49bd-5b26-8c8248d5089b.jpg",
		},
	},
];

const Solutions: React.FC = () => {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<section className="mx-auto px-4 sm:px-10 py-16 bg-white flex justify-center">
			<div className="w-[1170px] h-[890px]">
				<Heading
					level={2}
					className="text-center max-w-2xl mx-auto font-extrabold text-[42px] leading-[52px]"
					style={{ fontFamily: "Neurial Grotesk" }}
				>
					Providing the best solutions for your study
				</Heading>
				<p className="text-center text-sm sm:text-base text-[#4B4B4B] mt-2 max-w-xl mx-auto">
					You learn today and earn tomorrow. The roots of education are bitter but
					the fruits are sweet.
				</p>

				<div className="mt-12 flex flex-col md:flex-row justify-center gap-0">
					{features.map((f, i) => (
						<div
							key={i}
							className={`md:w-1/3 text-center cursor-pointer transition-all duration-300 ${
								activeTab === i
									? "border-b-2 border-blue-500 pb-4"
									: "border-b border-gray-200 pb-4 hover:border-gray-300"
							}`}
							onClick={() => setActiveTab(i)}
						>
							<h3
								className={`font-semibold text-base mb-2 ${
									activeTab === i ? "text-black" : "text-gray-600"
								}`}
							>
								{f.title}
							</h3>
						</div>
					))}
				</div>

				<div className="mt-12 flex flex-col md:flex-row gap-10 items-center">
					<div className="md:w-1/2">
						<h2
							className="font-extrabold text-[42px] leading-[52px] mb-4 text-black w-[470px]"
							style={{ 
								fontFamily: "Neurial Grotesk",
								fontWeight: 800,
								letterSpacing: "0%"
							}}
						>
							{features[activeTab].content.title}
						</h2>
						<p className="text-sm text-[#4B4B4B] max-w-md mb-6 leading-relaxed">
							{features[activeTab].content.description}
						</p>
						<button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-yellow-500 transition-colors">
							Start Learning
						</button>
					</div>
					<div className="md:w-1/2">
						<img
							className="rounded-[6px] w-[570px] h-[520px] object-cover"
							src={features[activeTab].content.image}
							alt="study"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Solutions;
