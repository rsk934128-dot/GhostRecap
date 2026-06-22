
"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_8px_rgba(var(--primary),0.4)]"
      >
        {/* Shield/Keyhole Shape */}
        <path
          d="M50 5C30 5 15 15 15 40C15 70 50 95 50 95C50 95 85 70 85 40C85 15 70 5 50 5Z"
          fill="currentColor"
          className="fill-primary"
        />
        {/* Stylized Ghost Eyes */}
        <circle cx="35" cy="40" r="6" fill="black" fillOpacity="0.8" />
        <circle cx="65" cy="40" r="6" fill="black" fillOpacity="0.8" />
        {/* Glow effect */}
        <path
          d="M30 65C30 65 40 75 50 75C60 75 70 65 70 65"
          stroke="black"
          strokeWidth="4"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
}
