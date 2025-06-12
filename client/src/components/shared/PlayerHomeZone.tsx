import React from "react";
import LudoPiece from "./LudoPiece";
import type { PlayerPiece } from "../../features/types";

interface PlayerHomeZoneProps {
  team:string;
  playerPieces: PlayerPiece[];
  currentTeamTurn: string;
  handleMove: (id: string) => void;
}

const glowClasses: Record<string, string> = {
  red: "shadow-[0_0_8px_2px_rgba(239,68,68,0.9),0_0_10px_2px_rgba(239,68,68,0.6)]",
  green: "shadow-[0_0_8px_2px_rgba(34,197,94,0.9),0_0_10px_2px_rgba(34,197,94,0.6)]",
  blue: "shadow-[0_0_8px_2px_rgba(59,130,246,0.9),0_0_10px_2px_rgba(59,130,246,0.6)]",
  yellow: "shadow-[0_0_8px_2px_rgba(250,204,21,0.9),0_0_10px_2px_rgba(250,204,21,0.6)]",
};

const bgColorMap: Record<string, string> = {
  red: "bg-red-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
  yellow: "bg-yellow-500",
};


const PlayerHomeZone: React.FC<PlayerHomeZoneProps> = ({
  team,
  playerPieces,
  currentTeamTurn,
  handleMove,
}) => {
  return (
    <div
      className={`${bgColorMap[team]} justify-center items-center flex ${
        currentTeamTurn === team ? `${glowClasses[team]} animate-pulse` : ""
      }`}
    >
      <div className={`w-[70%] h-[70%] bg-white justify-items-center items-center grid grid-cols-2 grid-rows-2`}>
        {playerPieces
          .filter((piece) => piece.team === team)
          .map((piece, idx) => (
            <span
              className={` relative w-1/2 h-1/2 flex justify-center items-center bg-${team}-500 rounded-full`}
              key={idx}
            >
              {piece.status === 0 && (
                <LudoPiece color={piece.team} id={piece.pieceId} pieceMove={handleMove} />
              )}
            </span>
          ))}
      </div>
    </div>
  );
};

export default PlayerHomeZone;
