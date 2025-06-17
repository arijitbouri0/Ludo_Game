import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { safePaths } from "../../components/layout/getStepPath";
import { giveArrayForMovingPath } from "../../features/Helper";
import type { LudoState, TeamColor } from "../../features/types";

const initialState: LudoState = {
  playerTurns: [],
  playerNames: [],
  currentPlayerTurnIndex: 0,
  prevPlayerTurnIndex: 0,
  teamHasBonus: false,
  currentPlayerTurnStatus: true,
  diceResult: null,
  playerPieces: [],
  winners: [],
  isOnline: false,
  cutPiece: null
};

const homeAndGamePaths: Record<TeamColor, { homeEntry: string; gameEntry: string }> = {
  blue: { homeEntry: "Y12", gameEntry: "B1" },
  green: { homeEntry: "R12", gameEntry: "G1" },
  red: { homeEntry: "B12", gameEntry: "R1" },
  yellow: { homeEntry: "G12", gameEntry: "Y1" },
};

const localGameSlice = createSlice({
  name: "localGame",
  initialState,
  reducers: {
    initPlayers: (state, action: PayloadAction<{ count: number; names: string[] }>) => {
      const { count, names } = action.payload;
      const teams: TeamColor[][] = [
        ["blue", "green"],
        ["blue", "red", "green"],
        ["blue", "red", "green", "yellow"],
      ];
      state.playerTurns = teams[count - 2];
      state.playerNames = names.slice(0, count);
      state.playerPieces = [];
      teams[count - 2].forEach((team) => {
        for (let i = 0; i < 4; i++) {
          const pieceId = `${team}${i}`;
          const position = `home_${team}`;
          state.playerPieces.push({
            team,
            position,
            score: 0,
            homePathEntry: homeAndGamePaths[team].homeEntry,
            gameEntry: homeAndGamePaths[team].gameEntry,
            pieceId,
            status: 0,
          });
        }
      });
    },
    rollDice: (state, action: PayloadAction<number>) => {
      if (!state.currentPlayerTurnStatus) return;
      state.diceResult = action.payload;
      state.currentPlayerTurnStatus = false;
      state.teamHasBonus = action.payload === 6;
    },
    skipTurn: (state) => {
      if (state.teamHasBonus) {
        state.teamHasBonus = false;
        state.currentPlayerTurnStatus = true;
      } else {
        state.currentPlayerTurnIndex = (state.currentPlayerTurnIndex + 1) % state.playerTurns.length;
        state.currentPlayerTurnStatus = true;
      }
      state.diceResult = 0;
    },
    unlockPiece: (state, action: PayloadAction<string>) => {
      const piece = state.playerPieces.find(p => p.pieceId === action.payload);
      if (!piece || piece.team !== state.playerTurns[state.currentPlayerTurnIndex]) return;
      if (piece.status === 0 && state.diceResult === 6) {
        piece.status = 1;
        piece.position = homeAndGamePaths[piece.team].gameEntry;
        state.diceResult = 0;
        state.currentPlayerTurnStatus = true;
      }
    },

    movePiece: (state, action: PayloadAction<{ id: string; newPosition: string }>) => {
      const piece = state.playerPieces.find(p => p.pieceId === action.payload.id);
      if (!piece || piece.team !== state.playerTurns[state.currentPlayerTurnIndex]) return;
      if (piece.status !== 1 || state.diceResult === null) return;
      const pathArray = giveArrayForMovingPath(piece, state.diceResult);
      const lastPos = pathArray[pathArray.length - 1];

      const opponentPieces = state.playerPieces.filter(p =>
        p.team !== piece.team &&
        p.status === 1 &&
        p.position === lastPos &&
        !safePaths.includes(p.position)
      );

      if (opponentPieces.length > 0) {
        const opponent = opponentPieces[0];
        opponent.score = 0;
        opponent.position = `home_${opponent.team}`;
        opponent.status = 0;
        state.teamHasBonus = true;
        state.currentPlayerTurnStatus = true;
        if (state.isOnline) {
          state.cutPiece = {
            by: state.playerNames[state.currentPlayerTurnIndex],
            pieceId: opponent.pieceId,
          };
        }
      }

      piece.position = action.payload.newPosition;
      piece.score += pathArray.length;
      if (piece.position === "home") {
        piece.status = 2;
      }
      const team = piece.team;
      const allHome = state.playerPieces.filter(p => p.team === team).every(p => p.status === 2);
      if (allHome && !state.winners.includes(team)) {
        state.winners.push(team);
      }
      if (!state.teamHasBonus && state.diceResult === 6) {
        state.teamHasBonus = true;
        state.currentPlayerTurnStatus = true;
      } else {
        state.currentPlayerTurnStatus = false;
      }
      state.diceResult = 0;
    },

    setOnline: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setTurnIndex: (state, action: PayloadAction<number>) => {
      state.currentPlayerTurnIndex = action.payload;
    },

    setTurnStatus: (state, action: PayloadAction<boolean>) => {
      state.currentPlayerTurnStatus = action.payload;
    },
    setTeamHasBonus: (state, action: PayloadAction<boolean>) => {
      state.teamHasBonus = action.payload;
    },
    clearCutPiece: (state) => {
      state.cutPiece = null;
    },
    cutPieceFromSocket: (
      state,
      action: PayloadAction<{ pieceId: string }>
    ) => {
      const { pieceId } = action.payload;
      const piece = state.playerPieces.find((p) => p.pieceId === pieceId);
      if (!piece) return;
      piece.score = 0;
      piece.position = `home_${piece.team}`;
      piece.status = 0;
      state.teamHasBonus = true;
      state.currentPlayerTurnStatus = true;
    },
    resetGame: () => initialState,
  },
});

export const {
  initPlayers,
  rollDice,
  skipTurn,
  unlockPiece,
  movePiece,
  resetGame,
  setOnline,
  setTurnIndex,
  setTurnStatus,
  setTeamHasBonus,
  clearCutPiece,
  cutPieceFromSocket
} = localGameSlice.actions;

export default localGameSlice;
