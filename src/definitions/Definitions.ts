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
}
export interface Player {
  name: string;
  rank?: number;
  previousRank?: number;
  stats?: Stats;
}

export const ALL_TEAM_RATINGS = [
  "5 stars",
  "4.5 stars",
  "4 stars",
  "3.5 stars",
  "3 stars",
];
type RatingTuple = typeof ALL_TEAM_RATINGS;
export type TeamRating = RatingTuple[number];

export interface Team {
  name: string;
  country: string;
  league: string;
  rating: TeamRating;
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

export type TournamentMode = "1on1" | "2on2";

export type TournamentState = "FINISHED" | "RUNNING" | "NEW";

export type GameState = "FINISHED" | "RUNNING" | "UPCOMING" | "OPEN";

export interface TournamentTeam {
  players: Player[];
  team?: Team;
  stats?: Stats;
}

export interface PossibleDraw {
  team1: TournamentTeam;
  team2: TournamentTeam;
}

export interface Game {
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
  useableTeams: Team[];
}

export interface MatchDay {
  id: string;
  startDate: Date;
  players: Player[];
  mode: TournamentMode;
  // useableTeams: Team[];
  usedTeams: Team[];
  tournaments: Tournament[];
  state: TournamentState;
}
