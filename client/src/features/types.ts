// src/types/ludo.ts
export type PlayerColor = 'red' | 'green' | 'blue' | 'yellow';export type TeamColor = "blue" | "red" | "green" | "yellow";
export interface PlayerPiece {
  team: TeamColor;
  position: string; // board position ID or 'locked'
  score: number;
  homePathEntry: string;
  gameEntry: string;
  pieceId: string;
  status: 0 | 1 | 2; // 0 = locked, 1 = unlocked
}

export interface LudoState {
  playerTurns: TeamColor[];
  playerNames: string[];
  currentPlayerTurnIndex: number;
  prevPlayerTurnIndex: number | null;
  teamHasBonus: boolean;
  currentPlayerTurnStatus: boolean;
  diceResult: number | null;
  playerPieces: PlayerPiece[];
  winners: TeamColor [];
  isOnline:boolean;
}