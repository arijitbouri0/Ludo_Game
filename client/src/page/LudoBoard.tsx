import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux";
import ResetGameDialog from "../components/Dialog/ResetGameDialouge";
import SettingsDialog from "../components/Dialog/SettingsDialog";
import WinnerDialog from "../components/Dialog/WinnerDialog";
import Dice from "../components/shared/Dice";
import LudoPiece from "../components/shared/LudoPiece";
import PlayerHomeZone from "../components/shared/PlayerHomeZone";
import PlayerName from "../components/shared/PlayerName";
import TeamPath from "../components/shared/TeamPath";
import { CUT_PIECE, FINISHED_MOVE, MOVE_PIECE, PIECE_CUTED, PIECE_MOVED, PIECE_UNLOCKED, TURN_CHANGED } from "../constants/events";
import { useSocket } from "../context/SocketContext";
import { delay, giveArrayForMovingPath } from "../features/Helper";
import type { PlayerPiece } from "../features/types";
import { useSocketEvents, type SocketHandlerMap } from "../hooks/hook";
import { clearCutPiece, cutPieceFromSocket, movePiece, setTeamHasBonus, setTurnIndex, setTurnStatus, skipTurn, unlockPiece } from "../redux/reducers/localGameSlice";
import type { RootState } from "../redux/store";

const LudoBoard = () => {
  const { currentPlayerTurnIndex, playerTurns, playerPieces, diceResult, playerNames, teamHasBonus, winners, isOnline } =
    useSelector((state: RootState) => state.localGame);
  const socket = useSocket()
  const { user } = useSelector((state: RootState) => state.auth);
  const currentPlayerName = playerNames[currentPlayerTurnIndex];
  const currentTeamTurn = playerTurns[currentPlayerTurnIndex];
  const dispatch = useDispatch();
  const store = useStore();
  const handleMove = async (id: string) => {
    const piece = playerPieces.find((p) => p.pieceId === id);
    if (!piece || piece.team !== currentTeamTurn || piece.status !== 1 || !diceResult) return;

    if (isOnline && socket) {
      socket.emit(MOVE_PIECE, { id, by: user?.username });
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

  const handlePieceUnlockedListener = useCallback(({ id }: { id: string }) => {
    dispatch(unlockPiece(id));
  }, [dispatch]);

  const handlePieceMovedListener = useCallback(async ({ id, dice }: { id: string, dice: number }) => {
    if (!dice) return;
    await delay(100);
    const latestPieces: PlayerPiece[] = (store.getState() as RootState).localGame.playerPieces;
    const piece = latestPieces.find(p => p.pieceId === id);
    if (!piece) return;

    const pathArray = giveArrayForMovingPath(piece, dice);
    const totalDelay = pathArray.length * 150;
    pathArray.forEach((pos, index) => {
      setTimeout(() => {
        dispatch(movePiece({ id: piece.pieceId, newPosition: pos }));
      }, index * 150);
    });

    setTimeout(() => {
      const cut = (store.getState() as RootState).localGame.cutPiece;
      if (cut && socket && user?.username === currentPlayerName) {
        socket.emit(CUT_PIECE, cut);
        dispatch(clearCutPiece());
      }

      if (socket && user?.username === currentPlayerName) {
        socket.emit(FINISHED_MOVE, { by: user?.username });
      }

      if (!isOnline) {
        dispatch(skipTurn());
      }
    }, totalDelay + 50);
  }, [dispatch, store, socket, user?.username, isOnline, currentPlayerName]);

  const handleTurnChangedListener = useCallback(({ to, hasBonus }: { to: string, hasBonus?: boolean }) => {
    const newIndex = playerNames.findIndex((name) => name === to);
    if (newIndex !== -1) {
      dispatch(setTurnIndex(newIndex));
      dispatch(setTurnStatus(true));
      if (hasBonus !== undefined) {
        dispatch(setTeamHasBonus(hasBonus));
      }
    }
  }, [playerNames, dispatch])

  const alreadyCut = useRef(new Set<string>());

  const handleCutPieceListener = useCallback(({ pieceId }: { pieceId: string }) => {
    if (alreadyCut.current.has(pieceId)) return;
    alreadyCut.current.add(pieceId);
    dispatch(cutPieceFromSocket({ pieceId }));
  }, [dispatch]);


  const eventHandler: SocketHandlerMap<{
    [PIECE_UNLOCKED]: { id: string };
    [PIECE_MOVED]: { id: string; dice: number };
    [TURN_CHANGED]: { to: string; hasBonus?: boolean };
    [PIECE_CUTED]: { pieceId: string };
  }> = {
    [PIECE_UNLOCKED]: handlePieceUnlockedListener,
    [PIECE_MOVED]: handlePieceMovedListener,
    [TURN_CHANGED]: handleTurnChangedListener,
    [PIECE_CUTED]: handleCutPieceListener,
  };

  useSocketEvents(socket, eventHandler)

  return (
    <div className="w-dvw min-h-dvh flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-30 px-4 pt-20 pb-6 overflow-y-auto relativ">
      <div className="absolute top-0 left-0 w-full flex justify-between px-4 py-3 z-50">
        <ResetGameDialog />
        <SettingsDialog />
      </div>
      <div className="grid grid-cols-[2fr_1fr_2fr] grid-rows-[2fr_1fr_2fr] relative w-full max-w-[500px] aspect-square border-[10px] rounded-sm border-black shadow-2xl shrink-0">
        {playerTurns?.map((value, idx) => {
          return <PlayerName key={idx} name={playerNames[idx]} color={value} />
        })}
        <PlayerHomeZone team="red" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
        <TeamPath teamColor="green" handleMove={handleMove} />
        <PlayerHomeZone team="green" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
        <TeamPath teamColor="red" handleMove={handleMove} />
        <div className="relative flex flex-col items-center justify-center border border-black font-bold text-xs sm:text-sm">
          <div className="grid grid-cols-3 grid-rows-4 gap-[1px] w-full h-full">
            {homePieces.map(piece => (
              <div
                key={piece.pieceId}
                className="w-full h-full flex items-center justify-center"
              >
                <LudoPiece
                  color={piece.team}
                  id={piece.pieceId}
                  pieceMove={handleMove}
                />
              </div>
            ))}
          </div>
          <p className=" text-red-500 -z-10 absolute text-4xl md:text-6xl">🏆</p>
        </div>
        <TeamPath teamColor="yellow" handleMove={handleMove} />
        <PlayerHomeZone team="blue" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
        <TeamPath teamColor="blue" handleMove={handleMove} />
        <PlayerHomeZone team="yellow" playerPieces={playerPieces} currentTeamTurn={currentTeamTurn} handleMove={handleMove} />
      </div>

      <div className="md:w-[180px] w-[150px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-5 rounded-lg shadow-2xl space-y-3 border border-gray-700">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold text-blue-400">
          {!isOnline && currentPlayerName}
        </h2>

        <div className="shadow-md">
          <Dice />
        </div>

        <p className="text-xs sm:text-sm md:text-base text-gray-300 text-center font-medium">
          {isOnline ? (
            user?.username === currentPlayerName ? (
              teamHasBonus ? "🎉 You got a bonus turn!" : "✨ Your Turn"
            ) : (
              `${currentPlayerName}'s Turn`
            )
          ) : (
            teamHasBonus ? "🎁 Got a bonus turn!" : "🔄 Turn"
          )}
        </p>
      </div>

      <WinnerDialog open={winnerModalOpen} setOpen={setWinnerModalOpen} winners={winners} />
    </div>

  );
};

export default LudoBoard;
