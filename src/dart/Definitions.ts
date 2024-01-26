import { GameState, TournamentState } from "definitions/Definitions";

export interface DPlayer {
  name: string;
}

export interface DartNight {
  id: number;
  startDate: string;
  at?: DPlayer;
  players: DPlayer[];
  state: TournamentState;
  games: DartGame[];
  tournaments: DartTournament[];
}
export interface DartTournament {
  id: number;
  state: TournamentState;
  teams: DartTeam[];
  games: DartGame[];
  tournamentSettings: DartTournamentSettings;
  gameSettings: GameSettings;
  withSecondRound: boolean;
  started?: string;
  finished?: string;
}

export interface DartTournamentSettings {
  mode: DartTournamentMode;
  teamMode: TeamMode;
}

export interface DartTeam {
  name: string;
  players: DPlayer[];
}

export interface DartGame {
  dartNightId?: number;
  dartTournamentId?: number;
  state: GameState;
  sequence?: number;
}
export interface X01Game extends DartGame {
  type: "X01";
  settings: X01GameSettings;
  players: X01Player[];
  finishedPlayers: X01Player[];
  round: number;
}
export interface CricketGame extends DartGame {
  type: "Cricket";
  settings: CricketSettings;
  players: CricketPlayer[];
  finishedPlayers: CricketPlayer[];
  round: number;
}

export interface ATCGame extends DartGame {
  type: "ATC";
  settings: ATCSettings;
  players: ATCPlayer[];
  finishedPlayers: ATCPlayer[];
  round: number;
}

export interface ShooterGame extends DartGame {
  type: "Shooter";
  settings: ShooterSettings;
  players: ShooterPlayer[];
  finishedPlayers: ShooterPlayer[];
  round: number;
}

export interface EliminationGame extends DartGame {
  type: "Elimination";
  settings: EliminationSettings;
  players: EliminationPlayer[];
  finishedPlayers: EliminationPlayer[];
  round: number;
}

export interface KeyboardEvent {
  p: number;
  double: boolean;
  triple: boolean;
}

export interface DartPlayer {
  team: DartTeam;
  active: boolean;
  finishRank: number;
}
export interface X01Player extends DartPlayer {
  score: X01Score;
}
export interface EliminationPlayer extends DartPlayer {
  score: EliminationScore;
}
export interface CricketPlayer extends DartPlayer {
  score: CricketScore;
}
export interface ATCPlayer extends DartPlayer {
  score: ATCScore;
  dartsThrown: number;
}

export interface ShooterPlayer extends DartPlayer {
  score: ShooterScore;
  dartsThrown: number;
}

export interface X01Score {
  remaining: number;
  average: number;
  tries: X01Try[];
}

export interface EliminationScore {
  points: number;
  average: number;
  tries: X01Try[];
}

export interface CricketScore {
  points: number;
  tries: CricketTry[];
}
export interface ATCScore {
  tries: ATCTry[];
  hits: Map<number, ATCHitScore | undefined>;
}

export interface ATCTry {
  score: ATCHitScore;
  currentNumber: number;
}

export interface ShooterScore {
  points: number;
  tries: ShooterTry[];
  openNumbers: number[];
}

export interface Try {
  number: number;
  multiplier: number;
  points: number;
  score: ATCHitScore;
}
export interface X01Try extends Try {}
export interface CricketTry extends Try {
  hits: number;
  cutThroat: string[];
}
export interface ShooterTry extends Try {}

export interface GameSettings {
  choosenGame: DartGameMode;
  x01: X01GameSettings;
  cricket: CricketSettings;
  atc: ATCSettings;
  shooter: ShooterSettings;
  elimination: EliminationSettings;
}

export interface X01GameSettings {
  kind: X01Kind;
  startKind: X01StartKind;
  finishKind: X01FinishKind;
}

export interface EliminationSettings {
  kind: X01Kind;
  finishKind: X01FinishKind;
}

export interface CricketSettings {
  mode: CricketMode;
  numbersMode: CricketNumbersMode;
  numbers: number[];
}

export interface ATCSettings {
  mode: ATCMode;
  hitMode: ATCHitMode;
  numberMode: ATCNumberMode;
  numbers: number[];
}

export interface ShooterCountSettings {
  single: number;
  double: number;
  triple: number;
  singleBull: number;
  bull: number;
}
export interface ShooterSettings {
  rounds: number;
  numberMode: ShooterNumberMode;
  countSettings: ShooterCountSettings;
  numbers: number[];
}

export const ALL_DART_TOURNAMENT_MODES: DartTournamentMode[] = ["LEAGUE", "KO"];
export type DartTournamentMode = "LEAGUE" | "KO";
export const ALL_DART_GAME_MODES: DartGameMode[] = [
  "X01",
  "CRICKET",
  "ATC",
  "SHOOTER",
  "ELIMINATION",
];
export type DartGameMode =
  | "X01"
  | "CRICKET"
  | "ATC"
  | "SHOOTER"
  | "ELIMINATION";

export type ShooterNumberMode = "RANDOM" | "SELECTED";

export type ATCMode = "DEFAULT" | "QUICK";
export type ATCHitMode = "SINGLE" | "DOUBLE" | "TRIPLE";
export type ATCNumberMode = "SEQUENCIAL" | "CLOCKWISE" | "COUNTERCLOCKWISE";
export type ATCHitScore = "SINGLE" | "DOUBLE" | "TRIPLE" | "MISS";

export type CricketMode = "DEFAULT" | "CUT THROAT";
export type CricketNumbersMode = "DEFAULT" | "RANDOM" | "PICKIT";

export const ALL_X01_KINDS: X01Kind[] = [301, 501, 701, 901];
export type X01Kind = 301 | 501 | 701 | 901;

export type X01StartKind = "SINGLE IN" | "DOUBLE IN";
export type X01FinishKind = "SINGLE OUT" | "DOUBLE OUT" | "MASTERS OUT";

export const ALL_TEAM_MODES: TeamMode[] = ["SINGLE", "TEAM"];
export type TeamMode = "SINGLE" | "TEAM";
