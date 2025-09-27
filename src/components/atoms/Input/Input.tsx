import React, { useState } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    isPassword?: boolean; 
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ isPassword = false, className = "", type = "text", ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);

        return (
            <div className={isPassword ? "relative" : ""}>
                <input
                    ref={ref}
                    type={isPassword ? (showPassword ? "text" : "password") : type}
                    className={`w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${isPassword ? "pr-14" : ""
                        } ${className}`}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-sm text-black hover:text-blue-500"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";
