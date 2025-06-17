import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { PlayerColor } from "../../features/types";
import { unlockPiece } from "../../redux/reducers/localGameSlice";
import type { RootState } from "../../redux/store";
import { useSocket } from "../../context/SocketContext";

interface LudoPieceProps {
  color: PlayerColor;
  id: string;
  pieceMove: (id: string) => void;
}

const colorMap: Record<PlayerColor, string> = {
  red: "#ef4444",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#eab308",
};

const LudoPiece: React.FC<LudoPieceProps> = ({ color, id, pieceMove }) => {
  const dispatch = useDispatch();
  const { playerPieces, playerNames, currentPlayerTurnIndex, isOnline } = useSelector((state: RootState) => state.localGame);
  const piece = playerPieces.find((p) => p.pieceId === id);
  const currentPlayerName = playerNames[currentPlayerTurnIndex];
  const socket = useSocket();

  const handleMove = async (id: string) => {
    if (!piece || piece.status === 2) return;
    if (piece.status === 0) {
      if (isOnline && socket) {
        socket.emit("UNLOCK_PIECE", {
          id,
          by: currentPlayerName,
        });
      } else {
        dispatch(unlockPiece(id));
      }
    }
    if (piece.status === 1) {
      pieceMove(id);
    }
  };

  return (
    <div className="absolute z-20 cursor-pointer" onClick={() => handleMove(id)} id={`${id}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={`${colorMap[color]}`}
        strokeWidth="1.2"
        stroke="#000000"
        className="w-4 h-4 md:h-6 md:w-6"
      >
        <path
          fillRule="evenodd"
          d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default LudoPiece;
