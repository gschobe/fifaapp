export interface X01Game {
  startScoreKind: X01Kind;
  startKind: X01StartKind;
  finishKind: X01FinishKind;
  players: X01Player[];
  finishedPlayers: X01Player[];
  round: number;
}

export interface X01Player {
  name: string;
  active: boolean;
  finishRank: number;
  score: X01Score;
}

export interface X01Score {
  remaining: number;
  average: number;
  threeDartScore: (number | string)[][];
}

export type X01Kind = 301 | 501 | 701 | 901;

export type X01StartKind = "SINGLE IN" | "DOUBLE IN";
export type X01FinishKind = "SINGLE OUT" | "DOUBLE OUT" | "MASTERS OUT";
