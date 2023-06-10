/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction, Dictionary } from "@reduxjs/toolkit";
import {
  Game,
  MatchDay,
  Player,
  PossibleDraw,
  Stats,
  Tournament,
  TournamentTeam,
} from "../definitions/Definitions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./Store";
import { getPlayersSortedByPoints } from "utils/TableUtils";

export interface FifaGameState {
  matchDays: Dictionary<MatchDay>;
}

const initialState: FifaGameState = {
  matchDays: {},
};

export const matchDaySlice = createSlice({
  name: "matchDay",
  initialState,
  reducers: {
    addMatchDay: (state, action: PayloadAction<MatchDay>) => {
      state.matchDays[action.payload.id] = action.payload;
    },
    addMatchDays: (state, action: PayloadAction<MatchDay[]>) => {
      console.log(Object.entries(state.matchDays));
      action.payload.forEach((matchday) => {
        if (state.matchDays[matchday.id] === undefined) {
          state.matchDays[matchday.id] = {
            ...matchday,
            meta: { imported: true },
          };
        }
      });
    },
    addTournament: (
      state,
      action: PayloadAction<{ matchdayId: string; tournament: Tournament }>
    ) => {
      const matchday = state.matchDays[action.payload.matchdayId];
      if (matchday) {
        matchday.tournaments.forEach((t) => (t.state = "FINISHED"));
        matchday.tournaments = [
          ...matchday.tournaments,
          action.payload.tournament,
        ];
      }
    },
    setTournamentTeams: (
      state,
      action: PayloadAction<{
        matchdayId: string;
        tournamentId: string;
        tTeams: TournamentTeam[];
        games: Game[];
        clearUsed: boolean;
      }>
    ) => {
      const matchday = state.matchDays[action.payload.matchdayId];
      if (matchday) {
        const tournament = matchday?.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );

        if (tournament) {
          tournament.tournamentTeams = action.payload.tTeams;
          tournament.games = action.payload.games;
          if (action.payload.clearUsed) {
            matchday.usedTeams = [...matchday.usedTeams].filter(
              (t) =>
                !tournament.useableTeams
                  .flatMap((ut) => ut?.name || "")
                  .includes(t.name)
            );
          }
          action.payload.tTeams.forEach((tt) => {
            if (tt.team) {
              matchday.usedTeams = matchday.usedTeams.concat(tt.team);
            }
          });
        }
      }
    },
    setPossibleDraws: (
      state,
      action: PayloadAction<{
        matchdayId: string;
        draw: PossibleDraw[];
      }>
    ) => {
      const matchday = state.matchDays[action.payload.matchdayId];
      if (matchday) {
        matchday.possibleDraws = action.payload.draw;
      }
    },
    startGame: (
      state,
      action: PayloadAction<{
        matchdayId: string;
        tournamentId: string;
        gameSeq: number | undefined;
      }>
    ) => {
      const matchday = state.matchDays[action.payload.matchdayId];
      if (matchday) {
        matchday.state = "RUNNING";

        const tournament = matchday.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );

        if (tournament) {
          tournament.state = "RUNNING";
          if (action.payload.gameSeq === 1) {
            tournament.started = new Date().toLocaleString();
          }

          const game = tournament.games.find(
            (g) => g.sequence === action.payload.gameSeq
          );
          if (game) {
            game.state = "RUNNING";
            game.goalsHome = 0;
            game.goalsAway = 0;
          }

          const next = tournament.games.find(
            (g) => g.sequence === (action.payload.gameSeq || 1) + 1
          );

          if (next) {
            next.state = "UPCOMING";
          }
        }
      }
    },
    correctGame: (
      state,
      action: PayloadAction<{
        matchdayId: string;
        tournamentId: string;
        gameSeq: number | undefined;
        newHomeScore: number;
        newAwayScore: number;
      }>
    ) => {
      const matchDay = state.matchDays[action.payload.matchdayId];
      if (matchDay) {
        const tournament = matchDay.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );

        if (tournament) {
          const game = tournament.games.find(
            (g) => g.sequence === action.payload.gameSeq
          );
          if (game) {
            const player = tournament.players.concat(matchDay.players);
            const home = player.filter((p) =>
              game.homePlayer.players.map((gp) => gp.name).includes(p.name)
            );
            const { homePoints, awayPoints } = calculatePoints(
              game.goalsHome || 0,
              game.goalsAway || 0
            );
            const newPoints = calculatePoints(
              action.payload.newHomeScore,
              action.payload.newAwayScore
            );

            home.forEach((p) => {
              const stats = p.stats;
              correctStats(
                "home",
                stats,
                game,
                homePoints,
                newPoints.homePoints,
                action.payload.newHomeScore,
                action.payload.newAwayScore
              );
            });

            const away = player.filter((p) =>
              game.awayPlayer.players.map((gp) => gp.name).includes(p.name)
            );
            away.forEach((p) => {
              const stats = p.stats;
              correctStats(
                "away",
                stats,
                game,
                awayPoints,
                newPoints.awayPoints,
                action.payload.newHomeScore,
                action.payload.newAwayScore
              );
            });

            game.goalsHome = action.payload.newHomeScore;
            game.goalsAway = action.payload.newAwayScore;
          }
          const sorted = getPlayersSortedByPoints(matchDay.players);
          matchDay.players = sorted;
        }
      }
    },
    finishGame: (
      state,
      action: PayloadAction<{
        matchdayId: string;
        tournamentId: string;
        gameSeq: number | undefined;
      }>
    ) => {
      const matchDay = state.matchDays[action.payload.matchdayId];
      if (matchDay) {
        const tournament = matchDay.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );

        if (tournament) {
          if (
            Math.max(...tournament.games.map((g) => g.sequence)) ===
            action.payload.gameSeq
          ) {
            tournament.finished = new Date().toLocaleString();
          }
          const game = tournament.games.find(
            (g) => g.sequence === action.payload.gameSeq
          );
          if (game) {
            game.state = "FINISHED";

            // update score
            const player = tournament.players.concat(matchDay.players);

            const home = player.filter((p) =>
              game.homePlayer.players.map((gp) => gp.name).includes(p.name)
            );
            const { homePoints, awayPoints } = calculatePoints(
              game.goalsHome || 0,
              game.goalsAway || 0
            );

            home.forEach((p) => {
              const stats = p.stats;
              updateStats("home", stats, game, homePoints);
            });

            const away = player.filter((p) =>
              game.awayPlayer.players.map((gp) => gp.name).includes(p.name)
            );
            away.forEach((p) => {
              const stats = p.stats;
              updateStats("away", stats, game, awayPoints);
            });
          }

          tournament.players = getPlayersSortedByPoints(tournament.players);

          const sorted = getPlayersSortedByPoints(matchDay.players);
          matchDay.players = sorted;

          if (
            tournament.games.find((g) => g.state !== "FINISHED") === undefined
          ) {
            tournament.state = "FINISHED";
          }
        }
      }
    },
    setScore: (
      state,
      action: PayloadAction<{
        matchdayId: string;
        tournamentId: string;
        gameSeq: number | undefined;
        homeScore?: number | undefined;
        awayScore?: number | undefined;
      }>
    ) => {
      const tournament = state.matchDays[
        action.payload.matchdayId
      ]?.tournaments.find((t) => t.id === action.payload.tournamentId);

      if (tournament) {
        const game = tournament.games.find(
          (g) => g.sequence === action.payload.gameSeq
        );
        if (game) {
          if (action.payload.homeScore !== undefined) {
            game.goalsHome = action.payload.homeScore;
          }
          if (action.payload.awayScore !== undefined) {
            game.goalsAway = action.payload.awayScore;
          }
        }
      }
    },
    setMatchdayPlayers: (
      state,
      action: PayloadAction<{ matchdayId: string; players: Player[] }>
    ) => {
      const matchDay = state.matchDays[action.payload.matchdayId];
      if (matchDay) {
        matchDay.players = action.payload.players;
      }
    },
    finishMatchday: (state, action: PayloadAction<string>) => {
      const matchDay = state.matchDays[action.payload];
      if (matchDay) {
        matchDay.state = "FINISHED";
        matchDay.tournaments.map((t) => t.state === "FINISHED");
      }
    },
    deleteMatchDay: (state, action: PayloadAction<string>) => {
      const matchDay = state.matchDays[action.payload];
      if (matchDay) {
        matchDay.state = "DELETED";
        const nextId = `D${
          Object.values(state.matchDays).filter(
            (md) => md && md.id.startsWith("D")
          ).length + 1
        }`;
        state.matchDays[nextId] = { ...matchDay, id: nextId };
        delete state.matchDays[action.payload];
      }
    },
    moveGameDown: (state, action: PayloadAction<Game>) => {
      const tournament = state.matchDays[
        action.payload.matchdayId
      ]?.tournaments.find((t) => t.id === action.payload.tournamentId);

      if (tournament) {
        const game = tournament.games.find(
          (g) => g.sequence === action.payload.sequence
        );
        const gameAfter = tournament.games.find(
          (g) => g.sequence === action.payload.sequence + 1
        );
        if (game && gameAfter) {
          game.sequence = game.sequence + 1;
          gameAfter.sequence = gameAfter.sequence - 1;
          if (game.state === "UPCOMING") {
            game.state = "OPEN";
            gameAfter.state = "UPCOMING";
          }
        }
      }
    },
    moveGameUp: (state, action: PayloadAction<Game>) => {
      const tournament = state.matchDays[
        action.payload.matchdayId
      ]?.tournaments.find((t) => t.id === action.payload.tournamentId);

      if (tournament) {
        const game = tournament.games.find(
          (g) => g.sequence === action.payload.sequence
        );
        const gameBefore = tournament.games.find(
          (g) => g.sequence === action.payload.sequence - 1
        );
        if (
          game &&
          gameBefore &&
          !["FINISHED", "RUNNING"].includes(gameBefore.state)
        ) {
          game.sequence = game.sequence - 1;
          gameBefore.sequence = gameBefore.sequence + 1;
          if (gameBefore.state === "UPCOMING") {
            gameBefore.state = "OPEN";
            game.state = "UPCOMING";
          }
        }
      }
    },
  },
});

export const { addMatchDays } = matchDaySlice.actions;

export const matchDayConnector = connect(
  (state: RootState) => ({
    matchDays: state.fifagames.matchDays,
  }),
  { ...matchDaySlice.actions },
  undefined,
  {
    areStatesEqual(nextState, prevState) {
      return nextState.fifagames == prevState.fifagames;
    },
  }
);

export type MatchDayStoreProps = ConnectedProps<typeof matchDayConnector>;

export default matchDaySlice.reducer;

export function calculatePoints(goalsHome: number, goalsAway: number) {
  const homePoints =
    goalsHome !== undefined && goalsAway != undefined && goalsHome > goalsAway
      ? 3
      : goalsHome === goalsAway
      ? 1
      : 0;
  const awayPoints = homePoints === 3 ? 0 : homePoints === 1 ? 1 : 3;
  return { homePoints, awayPoints };
}

export function updateStats(
  team: "home" | "away",
  stats: Stats | undefined,
  game: Game,
  points: number
) {
  if (stats) {
    stats.goalsScored = Number(
      (stats.goalsScored || 0) +
        (team === "home" ? game.goalsHome || 0 : game.goalsAway || 0)
    );
    stats.goalsAgainst = Number(
      (stats.goalsAgainst || 0) +
        (team === "home" ? game.goalsAway || 0 : game.goalsHome || 0)
    );
    stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
    stats.gamesWon = points === 3 ? (stats.gamesWon || 0) + 1 : stats.gamesWon;
    stats.gamesTie = points === 1 ? (stats.gamesTie || 0) + 1 : stats.gamesTie;
    stats.gamesLost =
      points === 0 ? (stats.gamesLost || 0) + 1 : stats.gamesLost;
    stats.points = (stats.points || 0) + points;
    calculateStatValues(stats);
  }
}

function correctStats(
  team: "home" | "away",
  stats: Stats | undefined,
  game: Game,
  points: number,
  newPoints: number,
  goalsHome: number,
  goalsAway: number
) {
  if (stats) {
    stats.goalsScored = Number(
      (stats.goalsScored || 0) -
        (team === "home" ? game.goalsHome || 0 : game.goalsAway || 0) +
        (team === "home" ? goalsHome : goalsAway)
    );
    stats.goalsAgainst = Number(
      (stats.goalsAgainst || 0) -
        (team === "home" ? game.goalsAway || 0 : game.goalsHome || 0) +
        (team === "home" ? goalsAway : goalsHome)
    );

    stats.gamesWon = points === 3 ? (stats.gamesWon || 0) - 1 : stats.gamesWon;
    stats.gamesTie = points === 1 ? (stats.gamesTie || 0) - 1 : stats.gamesTie;
    stats.gamesLost =
      points === 0 ? (stats.gamesLost || 0) - 1 : stats.gamesLost;
    stats.gamesWon =
      newPoints === 3 ? (stats.gamesWon || 0) + 1 : stats.gamesWon;
    stats.gamesTie =
      newPoints === 1 ? (stats.gamesTie || 0) + 1 : stats.gamesTie;
    stats.gamesLost =
      newPoints === 0 ? (stats.gamesLost || 0) + 1 : stats.gamesLost;

    stats.points = (stats.points || 0) - points + newPoints;

    calculateStatValues(stats);
  }
}

function calculateStatValues(stats: Stats) {
  stats.winPercentage =
    stats.gamesWon && stats.gamesPlayed
      ? Number(((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(0))
      : 0;
  stats.pointsPerGame =
    stats.points && stats.gamesPlayed
      ? Number((stats.points / stats.gamesPlayed).toFixed(1))
      : 0;
  stats.goalsPerGame =
    stats.goalsScored && stats.gamesPlayed
      ? Number((stats.goalsScored / stats.gamesPlayed).toFixed(1))
      : 0;
  stats.goalsAgainstPerGame =
    stats.goalsAgainst && stats.gamesPlayed
      ? Number((stats.goalsAgainst / stats.gamesPlayed).toFixed(1))
      : 0;
}
