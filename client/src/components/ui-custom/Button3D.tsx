import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface Button3DProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  ({ className, variant = "primary", size = "md", fullWidth = false, children, ...props }, ref) => {
    
    const baseStyles = "relative font-semibold rounded-xl transition-all active:translate-y-[4px] active:shadow-none outline-none focus:ring-2 focus:ring-offset-2";
    
    const variants = {
      primary: "bg-blue-600 text-white shadow-[0_4px_0_0_rgb(29,78,216)] hover:bg-blue-500",
      secondary: "bg-white text-slate-700 border-2 border-slate-200 shadow-[0_4px_0_0_rgb(203,213,225)] hover:bg-slate-50 hover:border-slate-300",
      danger: "bg-red-500 text-white shadow-[0_4px_0_0_rgb(185,28,28)] hover:bg-red-400",
      outline: "bg-transparent text-blue-600 border-2 border-blue-600 shadow-[0_4px_0_0_rgb(37,99,235)] hover:bg-blue-50"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button3D.displayName = "Button3D";