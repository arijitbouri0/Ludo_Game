import React from "react";

interface ArrowProps {
  direction?: "up" | "down" | "left" | "right";
}

const ArrowIcon: React.FC<ArrowProps> = ({ direction = "up" }) => {
  let rotation = "";

  switch (direction) {
    case "up":
      rotation = "rotate-0";
      break;
    case "down":
      rotation = "rotate-180";
      break;
    case "left":
      rotation = "-rotate-90";
      break;
    case "right":
      rotation = "rotate-90";
      break;
  }

  return (
    <svg
      className={`w-6 h-6 text-black ${rotation}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.4}
        d="M12 19V5m0 14-4-4m4 4 4-4"
      />
    </svg>
  );
};

export default ArrowIcon;
