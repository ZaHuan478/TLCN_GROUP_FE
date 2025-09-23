import React from "react";
import Heading from "../../atoms/Heading/Heading";
import { Button } from "../../atoms/Button/Button";

const images = [
	"https://storage.googleapis.com/a1aa/image/58d8156c-f67b-48e8-2510-10204268a664.jpg",
	"https://storage.googleapis.com/a1aa/image/d6003cb0-c7c6-46ba-7a7a-6147d056e752.jpg",
	"https://storage.googleapis.com/a1aa/image/b8867db4-a4fa-4f13-8406-b65dd7803cc0.jpg",
	"https://storage.googleapis.com/a1aa/image/978739cc-92a0-4eec-95e5-5e767c435e64.jpg",
];

const Hero: React.FC = () => {
	return (
		<section className="px-4 sm:px-10 pt-10 pb-16 bg-[#FFF0D9] max-w-7xl mx-auto">
			<div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
				<div className="lg:w-1/2">
					<Heading level={1} className="leading-[66px] max-w-md font-extrabold" style={{ fontFamily: 'Neurial Grotesk' }}>
						You learn today and earn tomorrow.
					</Heading>
					<p className="mt-4 text-sm sm:text-base max-w-md text-[#4B4B4B]">	
						You learn today and earn tomorrow. The roots of education are bitter but the fruits are sweet. If you learn today you can lead tomorrow.
					</p>
					<div className="mt-6 flex space-x-4">
						<Button
							variant="primary"
							className="w-[194px] h-[58px] rounded-[8px] bg-black text-white shadow font-[700] text-[18px] leading-[28px] hover:bg-yellow-400 hover:text-black transition-colors"
						>
							Start Learning
						</Button>
						<Button
							variant="primary"
							className="w-[194px] h-[58px] rounded-[8px] bg-black text-white shadow font-[700] text-[18px] leading-[28px] hover:bg-yellow-400 hover:text-black transition-colors"
						>
							Explore Courses
						</Button>
					</div>
				</div>

				<div className="lg:w-1/2 grid grid-cols-2 gap-6">

					<div className="flex flex-col gap-6">
						<img
							src={images[0]}
							alt="student-0"
							className="w-[270px] h-[412px] object-cover rounded-tl-[40px] rounded-br-[40px]"
						/>
						<img
							src={images[2]}
							alt="student-2"
							className="w-[270px] h-[232px] object-cover rounded-bl-[40px]"
						/>
					</div>

					<div className="relative flex flex-col items-center">
						<img
							src={images[1]}
							alt="student-1"
							className="w-[270px] h-[328px] object-cover rounded-tr-[40px] z-0"
						/>
						<img
							src={images[3]}
							alt="student-3"
							className="w-[270px] h-[270px] object-cover rounded-full absolute -bottom-[-120px] left-1/2 -translate-x-1/2 z-10 p-4 bg-[#FDF0DF]"
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
