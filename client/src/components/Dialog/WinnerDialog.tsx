import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch, useSelector } from "react-redux";
import { resetGame } from "../../redux/reducers/localGameSlice";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
import type { TeamColor } from "../../features/types";

interface WinnerDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  winners: TeamColor[];
}

const WinnerDialog: React.FC<WinnerDialogProps> = ({ open, setOpen, winners }) => {
  const { playerTurns, playerNames } = useSelector((state: RootState) => state.localGame);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNewGame = () => {
    dispatch(resetGame());
    navigate("/");
  };

  const getPlayerNameByTeam = (team: TeamColor) => {
    const index = playerTurns.indexOf(team);
    return index !== -1 ? playerNames[index] : "Unknown";
  };

  const getColorStyle = (color: TeamColor) => {
    const bg = {
      red: "bg-red-500",
      green: "bg-green-500",
      blue: "bg-blue-500",
      yellow: "bg-yellow-400",
    };
    return `${bg[color]} w-3 h-3 rounded-full`;
  };

  const isGameOver = winners.length === 3;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-80 max-w-[90%] shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4 text-center">
            {isGameOver ? "🏁 Game Over" : "🎉 Player Finished!"}
          </Dialog.Title>

          <div className="space-y-3">
            {winners.map((team, index) => (
              <div key={team} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={getColorStyle(team)}></span>
                  <span className="font-medium">{getPlayerNameByTeam(team)}</span>
                </div>
                <span className="text-gray-500">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}ᵗʰ`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-6">
            {!isGameOver && (
              <button
                onClick={() => setOpen(false)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Continue Playing
              </button>
            )}
            <button
              onClick={handleNewGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              New Game
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default WinnerDialog;
