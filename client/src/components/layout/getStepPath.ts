// types/paths.ts

export type PlayerColor = 'red' | 'green' | 'yellow' | 'blue';

export const mainPathArray: string[] = [
  'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12', 'G13',
  'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'Y9', 'Y10', 'Y11', 'Y12', 'Y13',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'B11', 'B12', 'B13',
];

// Home paths for each color
export const homePathEntries: Record<PlayerColor, string[]> = {
  red: ['Rh1', 'Rh2', 'Rh3', 'Rh4', 'Rh5', 'home'],
  green: ['Gh1', 'Gh2', 'Gh3', 'Gh4', 'Gh5', 'home'],
  yellow: ['Yh1', 'Yh2', 'Yh3', 'Yh4', 'Yh5', 'home'],
  blue: ['Bh1', 'Bh2', 'Bh3', 'Bh4', 'Bh5', 'home'],
};

// Safe spots (including home paths)
export const safePaths: string[] = [
  'R1', 'R9',
  'G1', 'G9',
  'Y1', 'Y9',
  'B1', 'B9',
  ...homePathEntries.red,
  ...homePathEntries.green,
  ...homePathEntries.yellow,
  ...homePathEntries.blue,
];

// All home path blocks combined
export const homePathArray: string[] = [
  ...homePathEntries.red,
  ...homePathEntries.green,
  ...homePathEntries.yellow,
  ...homePathEntries.blue,
];
