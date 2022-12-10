/* eslint-disable prettier/prettier */
export interface Player {
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesTie: number;
  gamesLost: number;
  goalsScored: number;
  goalsAgainst: number;
}

export type TeamRating =
  | "5 stars"
  | "4.5 stars"
  | "4 stars"
  | "3.5 stars"
  | "3 stars";
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

export interface Game {
  sequence: number;
  homePlayer: Player;
  homeTeam: Team;
  awayPlayer: Player;
  awayTeam: Team;
  goalsHome: number;
  goalsAway: number;
  state: "finsihed" | "running" | "upcoming" | "open";
}

export type TournamentMode = "1on1" | "2on2";

export type TournamentState = "FINISHED" | "RUNNING" | "NEW";

export interface Tournament {
  id: string;
  date: Date;
  mode: TournamentMode;
  players: Player[];
  games: Game[];
  state: TournamentState;
  withSecondRound: boolean;
}
