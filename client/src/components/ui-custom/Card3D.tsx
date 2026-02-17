import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface Card3DProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
}

export function Card3D({ className, children, hoverEffect = true, ...props }: Card3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.05)]",
        hoverEffect && "transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.1)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}