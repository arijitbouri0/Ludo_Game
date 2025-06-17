import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import diceSound from '../../assets/dice-sound.mp3';
import { DICE_ROLLED, ROLL_DICE } from "../../constants/events";
import { useSocket } from "../../context/SocketContext";
import { delay } from "../../features/Helper";
import type { PlayerPiece } from "../../features/types";
import { useSocketEvents, type SocketHandlerMap } from "../../hooks/hook";
import { rollDice, setTeamHasBonus, skipTurn } from "../../redux/reducers/localGameSlice";
import type { RootState } from "../../redux/store";
import store from "../../redux/store";
import { playSound } from "../../utils/playSound";

const faceRotations: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: 180 },
  3: { x: 0, y: 90 },
  4: { x: 0, y: -90 },
  5: { x: -90, y: 0 },
  6: { x: 90, y: 0 },
};

const Dice = () => {
  const dispatch = useDispatch();
  const {
    playerPieces,
    playerTurns,
    currentPlayerTurnIndex,
    currentPlayerTurnStatus,
    isOnline,
    playerNames
  } = useSelector((state: RootState) => state.localGame);
  const currentPlayerName = playerNames[currentPlayerTurnIndex];
  const { user } = useSelector((state: RootState) => state.auth);
  const socket = useSocket();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDice, setIsDice] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const animateDiceAndDispatch = async (newResult: number) => {
    const base = faceRotations[newResult];
    const spinX = base.x + 360 * (Math.floor(Math.random() * 2) + 1);
    const spinY = base.y + 360 * (Math.floor(Math.random() * 2) + 1);
    setRotation({ x: spinX, y: spinY });

    dispatch(rollDice(newResult));
    dispatch(setTeamHasBonus(newResult === 6));
    await delay(1000);

    const currentTeamTurn = playerTurns[currentPlayerTurnIndex];
    const totalUnlockedPieces = playerPieces.filter(
      (piece: PlayerPiece) => piece.team === currentTeamTurn && piece.status === 1
    );
    const hasBonus = newResult === 6;
    if (!isOnline) {
      if (!hasBonus && totalUnlockedPieces.length === 0) {
        dispatch(skipTurn());
      } else {
        timeoutRef.current = setTimeout(() => {
          dispatch(skipTurn());
        }, 10000);
      }
    }
    setIsDice(false);
  };
  const turnDice = async () => {
    if (isDice || !currentPlayerTurnStatus) return;
    if (isOnline && user?.username !== currentPlayerName) return;
    setIsDice(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const diceAudio = new Audio(diceSound);
    playSound(diceAudio, store.getState);
    if (isOnline && socket) {
      const currentTeamTurn = playerTurns[currentPlayerTurnIndex];
      const totalUnlockedPieces = playerPieces.filter(
        (p) => p.team === currentTeamTurn && p.status === 1
      ).length;

      socket.emit(ROLL_DICE, {
        noUnlockedPieces: totalUnlockedPieces === 0,
      });
      return;
    }
    const random = Math.random();
    const newResult = Math.floor(random * 6) + 1;
    animateDiceAndDispatch(newResult); // local mode
  };

  useEffect(() => {
    if (isOnline) {
      const shouldEnable = user?.username === currentPlayerName && currentPlayerTurnStatus;
      if (shouldEnable) {
        setIsDice(false); // Reset dice state
      }
    }
  }, [currentPlayerTurnIndex, currentPlayerTurnStatus, isOnline, user?.username, currentPlayerName]);


  useEffect(() => {
    if (!isOnline && currentPlayerTurnStatus) {
      timeoutRef.current = setTimeout(() => {
        dispatch(skipTurn());
        setIsDice(false);
      }, 10000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentPlayerTurnStatus, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        turnDice();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDice]);

  const handleDiceRolledListener = useCallback(({ value, by }: { value: number, by: string }) => {
    if (by === currentPlayerName) {
      animateDiceAndDispatch(value);
    }
  }, [user?.username,currentPlayerName]);


  const eventHandler: SocketHandlerMap<{
    [DICE_ROLLED]: { value: number; by: string };
  }> = {
    [DICE_ROLLED]: handleDiceRolledListener,
  };

  useSocketEvents(socket, eventHandler)



  return (
    <div
      className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md perspective ${isDice ? 'pointer-events-none opacity-50' : 'cursor-pointer'
        }`}
      onClick={turnDice}
    >
      <div
        className="relative w-full h-full transition-transform duration-700 transform-style preserve-3d"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className="absolute w-full h-full p-1 bg-white border border-black grid grid-cols-3 grid-rows-3 place-items-center"
            style={faceTransform(num)}
          >
            {renderDots(num)}
          </div>
        ))}
      </div>
    </div>
  );
};

const faceTransform = (face: number): React.CSSProperties => {
  const depth = 20;
  switch (face) {
    case 1: return { transform: `rotateY(0deg) translateZ(${depth}px)` };
    case 2: return { transform: `rotateY(180deg) translateZ(${depth}px)` };
    case 3: return { transform: `rotateY(-90deg) translateZ(${depth}px)` };
    case 4: return { transform: `rotateY(90deg) translateZ(${depth}px)` };
    case 5: return { transform: `rotateX(90deg) translateZ(${depth}px)` };
    case 6: return { transform: `rotateX(-90deg) translateZ(${depth}px)` };
    default: return {};
  }
};

const Dot = () => <div className="w-2 h-2 rounded-full bg-black" />;

const renderDots = (face: number): React.ReactElement[] => {
  const positions: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 1, 2, 6, 7, 8],
  };

  return Array.from({ length: 9 }).map((_, idx) =>
    positions[face].includes(idx) ? <Dot key={idx} /> : <div key={idx} />
  );
};

export default Dice;
