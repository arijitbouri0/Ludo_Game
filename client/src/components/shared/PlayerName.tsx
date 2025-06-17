import type { PlayerColor } from "../../features/types";

interface PlayerNameProps {
  name: string;
  color: PlayerColor;
}

const positionStyles: Record<PlayerColor, string> = {
  red: "-top-[80px] left-[15px]  md:top-[15px]  md:-left-[80px] ",
  green: "-top-[80px] right-[10px]  md:top-[15px]  md:-right-[80px]",
  blue: "-bottom-[80px] left-[15px]  md:bottom-[15px]  md:-left-[80px] ",
  yellow: "-bottom-[80px] right-[10px]  md:bottom-[15px]  md:-right-[80px] ",
};

const bgColors: Record<PlayerColor, string> = {
  red: "bg-red-600",
  green: "bg-green-600",
  blue: "bg-blue-600",
  yellow: "bg-yellow-400",
};

const textColors: Record<PlayerColor, string> = {
  red: "text-red-600",
  green: "text-green-600",
  blue: "text-blue-600",
  yellow: "text-yellow-500",
};

const PlayerName: React.FC<PlayerNameProps> = ({ name, color }) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] || "";
    const last = parts[1]?.[0] || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className={`absolute ${positionStyles[color]} flex flex-col items-center`}>
      <div
        className={`w-9 h-9 md:w-12 md:h-12 border-2 border-black rounded-full ${bgColors[color]} text-white flex items-center justify-center font-bold text-[14px] md:text-xl`}
      >
        {getInitials(name)}
      </div>
      <span
        className={` text-[12px] md:text-sm font-medium ${textColors[color]} text-center whitespace-nowrap`}
      >
        {name}
      </span>
    </div>
  );
};

export default PlayerName;

