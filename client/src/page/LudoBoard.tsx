import { useDispatch, useSelector } from "react-redux";
import ResetGameDialog from "../components/Dialog/ResetGameDialouge";
import SettingsDialog from "../components/Dialog/SettingsDialog";
import Dice from "../components/shared/Dice";
import PlayerHomeZone from "../components/shared/PlayerHomeZone";
import PlayerName from "../components/shared/PlayerName";
import TeamPath from "../components/shared/TeamPath";
import { delay, giveArrayForMovingPath } from "../features/Helper";
import { movePiece, setTurnIndex, setTurnStatus, skipTurn, unlockPiece } from "../redux/reducers/localGameSlice";
import type { RootState } from "../redux/store";
import LudoPiece from "../components/shared/LudoPiece";
import WinnerDialog from "../components/Dialog/WinnerDialog";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import type { PlayerPiece } from "../features/types";
import { useStore } from "react-redux";




const LudoBoard = () => {
  const { currentPlayerTurnIndex, playerTurns, playerPieces, diceResult, playerNames, teamHasBonus, winners, isOnline } =
    useSelector((state: RootState) => state.localGame);
  const socket = useSocket()
  console.log(currentPlayerTurnIndex);
  const { user } = useSelector((state: RootState) => state.auth);
  const currentPlayerName = playerNames[currentPlayerTurnIndex];
  const currentTeamTurn = playerTurns[currentPlayerTurnIndex];
  const dispatch = useDispatch();
  const store = useStore();

  const handleMove = async (id: string) => {
    const piece = playerPieces.find((p) => p.pieceId === id);
    if (!piece || piece.team !== currentTeamTurn || piece.status !== 1 || !diceResult) return;

    if (isOnline && socket) {
      socket.emit("MOVE_PIECE", { id, by: user?.username });
      return;
    }

    const pathArray = giveArrayForMovingPath(piece, diceResult);
    for (let i = 0; i < pathArray.length; i++) {
      dispatch(movePiece({ id, newPosition: pathArray[i] }));
      await delay(150);
    }
    dispatch(skipTurn());
  };
  const homePieces = playerPieces.filter(piece => piece.status === 2);
  const [winnerModalOpen, setWinnerModalOpen] = useState(false);
  const prevWinnersCount = useRef(winners.length);
  useEffect(() => {
    if (winners.length > prevWinnersCount.current && winners.length <= 3) {
      setWinnerModalOpen(true);
    }
    prevWinnersCount.current = winners.length;
  }, [winners]);

  const diceResultRef = useRef(diceResult);
  useEffect(() => {
    diceResultRef.current = diceResult;
  }, [diceResult]);


  useEffect(() => {
    if (!socket || !isOnline) return;

    const handlePieceUnlocked = ({ id }: { id: string }) => {
      dispatch(unlockPiece(id));
    };


    const handlePieceMoved = async ({ id, dice }: { id: string, dice: number }) => {
      if (!dice) return;

      await delay(100);

      const latestPieces: PlayerPiece[] = (store.getState() as RootState).localGame.playerPieces;
      const piece = latestPieces.find(p => p.pieceId === id);
      if (!piece) return;

      const pathArray = giveArrayForMovingPath(piece, dice);
      for (let i = 0; i < pathArray.length; i++) {
        dispatch(movePiece({ id: piece.pieceId, newPosition: pathArray[i] }));
        await delay(150);
      }
      // dispatch(skipTurn());
      if (isOnline && socket) {
        socket.emit("FINISHED_MOVE", { by: user?.username });
      }
    };
    const handleTurnSkipped = ({ by }: { by: string }) => {
      console.log(`Turn skipped by: ${by}`);
      // Optional: show a toast or UI message
    };

    const handleTurnChanged = ({ to }: { to: string }) => {
      console.log(`Turn changed to: ${to}`);
      const newIndex = playerNames.findIndex((name) => name === to);
      if (newIndex !== -1) {
        dispatch(setTurnIndex(newIndex));
      }
      dispatch(setTurnStatus(true)); // Assuming it's that player's turn
    };
    socket.on("PIECE_UNLOCKED", handlePieceUnlocked);
    socket.on("PIECE_MOVED", handlePieceMoved);
    socket.on("TURN_ENDED", handleTurnSkipped);
    socket.on("TURN_CHANGED", handleTurnChanged);
    return () => {
      socket.off("PIECE_UNLOCKED", handlePieceUnlocked);
      socket.off("PIECE_MOVED", handlePieceMoved);
      socket.off("TURN_ENDED", handleTurnSkipped);
      socket.off("TURN_CHANGED", handleTurnChanged);
    };
  }, [socket, isOnline, dispatch]);


  return (
    <div className="w-dvw h-dvh flex flex-col lg:flex-row justify-center items-center gap-6 p-4 relative">
      <ResetGameDialog />
      <SettingsDialog />
      <div className="grid grid-cols-[2fr_1fr_2fr] grid-rows-[2fr_1fr_2fr]  relative w-full max-w-[500px] aspect-square border border-black">
        {playerTurns?.map((value, idx) => {
          return <PlayerName key={idx} name={playerNames[idx]} color={value} />
        })}
        <PlayerHomeZone team="red" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
        <TeamPath teamColor="green" handleMove={handleMove} />
        <PlayerHomeZone team="green" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
        <TeamPath teamColor="red" handleMove={handleMove} />
        <div
          className="relative flex justify-center items-center gap-1 sm:min-w-[30px] sm:min-h-[30px] border border-black text-red-500 font-bold"
        >
          Home
          {homePieces.map(piece => (
            <LudoPiece
              key={piece.pieceId}
              color={piece.team}
              id={piece.pieceId}
              pieceMove={handleMove}
            />
          ))}
        </div>
        <TeamPath teamColor="yellow" handleMove={handleMove} />
        <PlayerHomeZone team="blue" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
        <TeamPath teamColor="blue" handleMove={handleMove} />
        <PlayerHomeZone team="yellow" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
      </div>
      <div className="w-full max-w-[180px] flex flex-col items-center justify-center bg-gray-100 p-2 lg:p-5 rounded-md shadow-md space-y-2">
        <h2 className="text-sm lg:text-lg font-semibold text-blue-700">
          {!isOnline && currentPlayerName}
        </h2>

        <Dice color="blue" />

        <p className="text-[15px] lg:text-sm text-gray-600">
          {isOnline ? (
            user?.username === currentPlayerName ? (
              teamHasBonus ? "You got a bonus turn!" : "Your Turn"
            ) : (
              `${currentPlayerName}'s Turn`
            )
          ) : (
            teamHasBonus ? "Got a bonus turn!" : "Turn"
          )}
        </p>
      </div>

      <WinnerDialog
        open={winnerModalOpen}
        setOpen={setWinnerModalOpen}
        winners={winners}
      />
    </div>

  );
};

export default LudoBoard;
