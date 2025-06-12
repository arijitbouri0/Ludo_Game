import { homePathArray, homePathEntries, mainPathArray } from "../components/layout/getStepPath";
import type { PlayerPiece, TeamColor } from "./types";


const homeAndGamePaths: Record<TeamColor, { homeEntry: string; gameEntry: string }> = {
  blue: { homeEntry: "Y12", gameEntry: "B1" },
  green: { homeEntry: "R12", gameEntry: "G1" },
  red: { homeEntry: "B12", gameEntry: "R1" },
  yellow: { homeEntry: "G12", gameEntry: "Y1" },
};

export const giveArrayForMovingPath = (piece: PlayerPiece, diceResult: number | null): string[] => {
  const movingArray: string[] = [];
  if (!diceResult) return movingArray;
  const { homeEntry } = homeAndGamePaths[piece.team];
  const homePathForTeam = homePathEntries[piece.team];
  if (homePathArray.includes(piece.position)) {
    let indexInHome = homePathForTeam.findIndex(p => p === piece.position);
    const stepsRemaining = homePathForTeam.length - 1 - indexInHome;
    if (diceResult > stepsRemaining) {
      return [];
    }
    for (let i = 0; i < diceResult; i++) {
      if (indexInHome + 1 < homePathForTeam.length) {
        indexInHome++;
        movingArray.push(homePathForTeam[indexInHome]);
      } else {
        return []; 
      }
    }


  } else {
    let indexOnMain = mainPathArray.findIndex(p => p === piece.position);

    for (let i = 0; i < diceResult; i++) {
      const currentPosition = mainPathArray[indexOnMain];

      if (currentPosition === homeEntry) {
        const stepsLeft = diceResult - i;

        for (let j = 0; j < stepsLeft; j++) {
          if (j < homePathForTeam.length) {
            movingArray.push(homePathForTeam[j]);
          }
        }
        break;
      } else {
        indexOnMain = (indexOnMain + 1) % mainPathArray.length;
        movingArray.push(mainPathArray[indexOnMain]);
      }
    }
  }
  return movingArray;
};


export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));