import { GameState, TournamentState } from "definitions/Definitions";
import { DartGame } from "store/DartStore";

export interface DPlayer {
  name: string;
}

export interface DartNight {
  id: number;
  startDate: string;
  at?: DPlayer;
  players: DPlayer[];
  state: TournamentState;
  settings: DartNightSettings;
  games: DartGame[];
  tournaments: DartTournament[];
  possibleDraws: DartPossibleDraw[];
}

export interface DartNightSettings {
  money: RankMoney[];
}

export interface RankMoney {
  rank: number;
  money: number;
  points?: number;
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

export interface DartPossibleDraw {
  dartTeams: DartTeam[];
}

export interface DartGameBase {
  id: number;
  dartNightId?: number;
  dartTournamentId?: number;
  state: GameState;
  sequence?: number;
  leg: number;
  set: number;
  round: number;
  sets: X01Set[];
}
export interface X01Game extends DartGameBase {
  type: "X01";
  settings: X01GameSettings;
  players: X01Player[];
  finishedPlayers: X01Player[];
  sets: X01Set[];
}

export interface X01Set {
  setNum: number;
  starter: string;
  winner?: string;
  legs: X01Leg[];
  state: TournamentState;
}

export interface X01Leg {
  legNum: number;
  winner?: string;
  starter: string;
  tries: X01LegTry[];
  state: TournamentState;
}

export interface X01LegTry {
  tryNum: number;
  player: string;
  try: X01Try;
}

export interface CricketGame extends DartGameBase {
  type: "Cricket";
  settings: CricketSettings;
  players: CricketPlayer[];
  finishedPlayers: CricketPlayer[];
}

export interface ATCGame extends DartGameBase {
  type: "ATC";
  settings: ATCSettings;
  players: ATCPlayer[];
  finishedPlayers: ATCPlayer[];
}

export interface ShooterGame extends DartGameBase {
  type: "Shooter";
  settings: ShooterSettings;
  players: ShooterPlayer[];
  finishedPlayers: ShooterPlayer[];
}

export interface EliminationGame extends DartGameBase {
  type: "Elimination";
  settings: EliminationSettings;
  players: EliminationPlayer[];
  finishedPlayers: EliminationPlayer[];
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
  legsWon: number;
  setsWon: number;
}
export interface X01Player extends DartPlayer {
  score: X01LegScore;
  setScore?: Map<number, X01SetScore>;
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
  setsScore?: ShooterSetScore[];
  dartsThrown: number;
}

export interface X01SetScore {
  legScores: X01LegScore[];
  average: number;
  setWon: boolean;
}
export interface X01LegScore {
  remaining: number;
  average: number;
  tries: X01Try[];
  finishRank?: number;
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

export interface ShooterSetScore {
  legsScore: ShooterScore[];
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
  teamMode: TeamMode;
  teamSize: number;
  x01: X01GameSettings;
  cricket: CricketSettings;
  atc: ATCSettings;
  shooter: ShooterSettings;
  elimination: EliminationSettings;
}

export interface BaseGameSettings {
  legs: number;
  sets: number;
}
export interface X01GameSettings extends BaseGameSettings {
  kind: X01Kind;
  startKind: X01StartKind;
  finishKind: X01FinishKind;
}

export interface EliminationSettings extends BaseGameSettings {
  kind: X01Kind;
  finishKind: X01FinishKind;
}

export interface CricketSettings extends BaseGameSettings {
  mode: CricketMode;
  numbersMode: CricketNumbersMode;
  numbers: number[];
}

export interface ATCSettings extends BaseGameSettings {
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
export interface ShooterSettings extends BaseGameSettings {
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
export type ATCHitScore = "SINGLE" | "DOUBLE" | "TRIPLE" | "MISS" | "BUST";

export type CricketMode = "DEFAULT" | "CUT THROAT";
export type CricketNumbersMode = "DEFAULT" | "RANDOM" | "PICKIT";

export const ALL_X01_KINDS: X01Kind[] = [301, 501, 701, 901];
export type X01Kind = 301 | 501 | 701 | 901;

export type X01StartKind = "SINGLE IN" | "DOUBLE IN";
export type X01FinishKind = "SINGLE OUT" | "DOUBLE OUT" | "MASTERS OUT";

export const ALL_TEAM_MODES: TeamMode[] = ["SINGLE", "TEAM"];
export type TeamMode = "SINGLE" | "TEAM";
