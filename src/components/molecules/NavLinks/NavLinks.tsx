import React from "react";
import { Link } from "react-router-dom";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/courses", label: "Courses" },
	{ to: "/mentor", label: "Mentor" },
	{ to: "/about", label: "About" },
	{ to: "/blog", label: "Blog" },
];

const NavLinks: React.FC<{ className?: string }> = ({ className = "" }) => (
	<ul className={`hidden md:flex space-x-8 text-sm font-semibold ${className}`}>
		{links.map((l) => (
			<li key={l.to}>
				<Link className="hover:text-yellow-400" to={l.to}>
					{l.label}
				</Link>
			</li>
		))}
	</ul>
);

export default NavLinks;
