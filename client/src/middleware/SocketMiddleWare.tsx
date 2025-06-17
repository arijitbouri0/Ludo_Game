// socketMiddleware.ts
import type { Middleware } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { safePaths } from '../components/layout/getStepPath';
import type { PlayerPiece } from '../features/types';

export const createSocketMiddleware = (socket: Socket): Middleware => store => next => (action :any) => {
  const result = next(action); // Allow reducer to update first
  switch (action.type) {
     case 'localGame/movePiece': {
          const state = store.getState();
          const movedPiece = state.localGame.playerPieces.find((p:PlayerPiece) => p.pieceId === action.payload.id);
          const opponent = state.localGame.playerPieces.find((p:PlayerPiece) =>
            p.team !== movedPiece.team &&
            p.position === action.payload.newPosition &&
            p.status === 1 &&
            !safePaths.includes(p.position)
          );
          socket.emit("PIECE_MOVED", {
            id: movedPiece.pieceId,
            newPosition: movedPiece.position,
            score: movedPiece.score,
            cutPiece: opponent
              ? {
                  id: opponent.pieceId,
                  team: opponent.team,
                }
              : null,
          });
          break;
        }
  }
  return result; // Continue to reducer
};
