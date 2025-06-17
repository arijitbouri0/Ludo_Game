import * as Dialog from "@radix-ui/react-dialog";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { FaGlobe } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CREATE_OR_FIND_ROOM, JOIN_ROOM, PLAYER_JOINED, START_GAME } from "../../constants/events";
import { useSocket } from "../../context/SocketContext";
import { useSocketEvents, type SocketHandlerMap } from "../../hooks/hook";
import { initPlayers, setOnline } from "../../redux/reducers/localGameSlice"; // or a separate online reducer

type CreateRoomResponse = {
  roomId: string;
  message: string;
};

type JoinRoomResponse = {
  success: boolean;
  message?: string;
};


const PlayOnlineDialog = () => {
  const [isMatching, setIsMatching] = useState(false);
  const [matched, setMatched] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const socket = useSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!players) return;

    setIsMatching(true);
    setMatched(false);

    socket?.emit(CREATE_OR_FIND_ROOM, { playerCount: players }, (res: CreateRoomResponse) => {
      setRoomId(res.roomId);

      socket.emit(JOIN_ROOM, { roomId: res.roomId }, (joinRes: JoinRoomResponse) => {
        if (joinRes.success) {
          toast.success("joined Room")
        } else {
          toast.error(joinRes.message || "Failed to join room");
        }
      });
    });
  };

  const playerJoinedListener = useCallback((name: string) => {
    toast.success(`${name} joined`)
  }, [])


  const startGameListener = useCallback(
    ({ players }: { players: { name: string }[] }) => {
      const names = players.map((p) => p.name);
      dispatch(initPlayers({ count: names.length, names }));
      dispatch(setOnline(true));
      setMatched(true);
      setTimeout(() => {
        navigate("/match");
      }, 1000);
    },
    [dispatch, navigate]
  );

  const eventHandler: SocketHandlerMap<{
    [START_GAME]: { players: { name: string }[] };
    [PLAYER_JOINED]: string;
  }> = {
    [START_GAME]: startGameListener,
    [PLAYER_JOINED]: playerJoinedListener,
  };
  useSocketEvents(socket, eventHandler)

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <div className="bg-gradient-to-br from-gray-800 to-gray-900  text-blue-400 border border-gray-700 rounded-xl p-4 shadow-2xl hover:shadow-lg cursor-pointer text-center font-semibold text-sm md:text-xl transition hover:scale-105 flex flex-row items-center justify-center space-x-6">
          <FaGlobe size={32} />
          <span>Play Online</span>
        </div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed z-50 bg-white text-black p-6 rounded-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-2">
            Play Online
          </Dialog.Title>
          <Dialog.Description className="mb-4 text-sm text-gray-600">
            Match with online players in real time.
          </Dialog.Description>

          {!isMatching && !matched && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="font-medium">Select Number of Players:</label>
                {[2, 3, 4].map((count) => (
                  <label key={count} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="players"
                      value={count}
                      checked={players === count}
                      onChange={() => setPlayers(count)}
                    />
                    <span>{count} Players</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                disabled={players === null}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full"
              >
                Find Match
              </button>
            </form>
          )}

          {isMatching && !matched && (
            <div className="text-center text-blue-600 font-medium py-4">
              🔍 Waiting for other players...
            </div>
          )}

          {matched && (
            <div className="text-center text-green-600 font-semibold py-4">
              🎉 Match found! Starting game...
            </div>
          )}

          <Dialog.Close
            className="absolute top-3 right-4 text-xl font-bold text-gray-600 hover:text-black"
            onClick={() => {
              setPlayers(null);
              setIsMatching(false);
              setMatched(false);
              setRoomId(null);
            }}
          >
            ×
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PlayOnlineDialog;
