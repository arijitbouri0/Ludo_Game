import * as Dialog from "@radix-ui/react-dialog";
import { FaUsers } from "react-icons/fa";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { initPlayers } from "../../redux/reducers/localGameSlice";

const PlayLocallyDialog = () => {
  const [players, setPlayers] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStartGame = () => {
    if (players) {
      const finalNames = names.map((name, idx) =>
        name.trim() === "" ? `Player ${idx + 1}` : name.trim()
      );
      dispatch(initPlayers({ count: players, names: finalNames })); // Updated: sending names too
      setStarted(true);
      setTimeout(() => {
        navigate("/match");
      }, 1000);
    }
  };

  const handleNameChange = (index: number, value: string) => {
    const updated = [...names];
    updated[index] = value;
    setNames(updated);
  };
  const handlePlayerSelect = (count: number) => {
    setPlayers(count);
    setNames(Array(count).fill("")); // reset names
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="bg-white text-blue-800 rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg cursor-pointer text-center font-semibold text-sm md:text-xl transition hover:scale-105 flex flex-row items-center justify-center space-x-6">
          <FaUsers size={32} />
          <span>Play Locally</span>
        </div>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed z-50 bg-white text-black p-6 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-2">Play Locally</Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-600">
            Play on the same device with friends or family.
          </Dialog.Description>

          {!started ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleStartGame();
              }}
              className="space-y-4"
            >
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Select Number of Players:</label>
                <div className="flex space-x-4">
                  {[2, 3, 4].map((count) => (
                    <label key={count} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="players"
                        value={count}
                        checked={players === count}
                        onChange={() => handlePlayerSelect(count)}
                      />
                      <span>{count} Players</span>
                    </label>
                  ))}
                </div>
              </div>

              {players && (
                <div className="space-y-2">
                  <label className="font-medium block">Enter Player Names:</label>
                  {Array.from({ length: players }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      className="w-full border rounded px-3 py-1 text-sm"
                      placeholder={`Player ${index + 1}`}
                      value={names[index] ?? ""}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                    />
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={players === null || names.length !== players}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                Start Game
              </button>
            </form>
          ) : (
            <div className="text-center text-green-600 font-semibold">
              🎮 Starting a {players}-Player Game...
            </div>
          )}

          <Dialog.Close className="absolute top-3 right-4 text-xl font-bold text-gray-600 hover:text-black">
            ×
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PlayLocallyDialog;

