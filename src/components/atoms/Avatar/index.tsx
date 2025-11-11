// atoms/Avatar.tsx
import React from "react";

type AvatarProps = {
    name?: string;
    size?: "sm" | "md";
    className?: string;
    bgColor?: string;
};

export const Avatar: React.FC<AvatarProps> = ({
    name = "U",
    size = "md",
    className = "",
    bgColor = "bg-blue-500",
}) => {
    const sizeClass = size === "sm" ? "w-6 h-6 text-xs" : "w-8 h-8 text-sm";
    return (
        <div
            className={`${sizeClass} ${bgColor} rounded-full flex items-center justify-center text-white font-semibold ${className}`}
        >
            {name[0]?.toUpperCase() || "U"}
        </div>
    );
};