/* eslint-disable prettier/prettier */

export interface Stats {
  gamesPlayed?: number;
  gamesWon?: number;
  gamesTie?: number;
  gamesLost?: number;
  goalsScored?: number;
  goalsAgainst?: number;
  points?: number;
  winPercentage?: number;
  pointsPerGame?: number;
}
export interface Player {
  name: string;
  rank?: number;
  previousRank?: number;
  stats?: Stats;
}

export const ALL_TEAM_RATINGS: number[] = [5, 4.5, 4, 3.5, 3];
type RatingTuple = typeof ALL_TEAM_RATINGS;
export type TeamRating = RatingTuple[number];

export interface Team {
  name: string;
  country: string;
  league: string;
  rating: number;
}

export interface TeamImport {
  Team: string;
  Country: string;
  League: string;
  OVA: number;
  ATT: number;
  MID: number;
  DEF: number;
  Rating: number;
}
export const ALL_TOURNAMENT_MODES: string[] = ["1on1", "2on2", "2on2-odd"];
type TournamentModeTuple = typeof ALL_TOURNAMENT_MODES;
export type TournamentMode = TournamentModeTuple[number];

export type TournamentState = "FINISHED" | "RUNNING" | "NEW";

export type GameState = "FINISHED" | "RUNNING" | "UPCOMING" | "OPEN";

export interface TournamentTeam {
  players: Player[];
  team?: Team;
  stats?: Stats;
}

export interface PossibleDraw {
  teams: TournamentTeam[];
}

export interface Location {
  id: string;
}
export interface Game {
  matchdayId: string;
  tournamentId: string;
  sequence: number;
  homePlayer: TournamentTeam;
  awayPlayer: TournamentTeam;
  state: GameState;
  goalsHome?: number;
  goalsAway?: number;
}
export interface Tournament {
  id: string;
  tournamentTeams: TournamentTeam[];
  games: Game[];
  players: Player[];
  state: TournamentState;
  withSecondRound: boolean;
  useableTeams: (Team | undefined)[];
  started?: string;
  finished?: string;
}

export interface MatchDay {
  id: string;
  startDate: string;
  at?: Player | undefined;
  players: Player[];
  mode: TournamentMode;
  // useableTeams: Team[];
  usedTeams: Team[];
  tournaments: Tournament[];
  state: TournamentState;
  possibleDraws: PossibleDraw[];
  meta?: {
    imported?: boolean;
  };
}
