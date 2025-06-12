import React from "react";
import GameBoard from "../components/GameBoard";
import PlayerControl from "../components/shared/PlayerControl";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const positionMap = {
  red: "top-left",
  green: "top-right",
  blue: "bottom-left",
  yellow: "bottom-right",
} as const;

const Game: React.FC = () => {
  const { players } = useSelector(
    (state: RootState) => state.localGame
  );
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-green-100 overflow-hidden">
      <div className="relative w-full max-w-[80vmin] aspect-square">
        <GameBoard />
        {players.map((player) => (
          <PlayerControl
            key={player.color}
            color={player.color}
            name={player.name}
            position={positionMap[player.color]}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
