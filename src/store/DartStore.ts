/* eslint-disable no-debugger */
import { Dictionary, PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ATCGame,
  CricketGame,
  DPlayer,
  DartNight,
  DartNightSettings,
  DartTournament,
  EliminationGame,
  ShooterGame,
  X01Game,
} from "dart/Definitions";
import { RootState } from "./Store";
import { ConnectedProps, connect } from "react-redux";

export type DartGame =
  | X01Game
  | CricketGame
  | ATCGame
  | ShooterGame
  | EliminationGame;
export interface DartState {
  players: Dictionary<DPlayer>;
  dartNight: Dictionary<DartNight>;
  fastGame: DartGame | undefined;
  fastGameHistory: DartGame[];
}

const initialState: DartState = {
  players: {},
  dartNight: {},
  fastGame: undefined,
  fastGameHistory: [],
};

const dartSlice = createSlice({
  name: "dart",
  initialState,
  reducers: {
    addDartPlayer: (state, action: PayloadAction<string>) => {
      state.players[action.payload] = {
        name: action.payload,
      };
    },
    setFastGame: (state, action: PayloadAction<DartGame>) => {
      const current = state.fastGame;
      current && state.fastGameHistory.push({ ...current });
      if (state.fastGameHistory.length >= 4) {
        state.fastGameHistory.sort((g1, g2) => g1.id - g2.id).shift();
      }
      state.fastGame = action.payload;
    },
    removeFastGame: (state) => {
      delete state.fastGame;
    },
    removeGame: (state, action: PayloadAction<DartGame>) => {
      const game = action.payload;
      if (game.dartNightId) {
        const dartNight = state.dartNight[game.dartNightId];
        if (dartNight) {
          if (game.dartTournamentId) {
            console.error("not implemented");
          } else {
            const gameIndex = dartNight.games.findIndex(
              (g) => g.id === game.id
            );
            if (gameIndex >= 0) {
              dartNight.games = [...dartNight.games].toSpliced(gameIndex, 1);
            }
          }
        }
      } else if (game.id === state.fastGame?.id) {
        delete state.fastGame;
      }
    },
    addDartNight: (state, action: PayloadAction<DartNight>) => {
      state.dartNight[action.payload.id] = action.payload;
    },
    removeDartNight: (state, action: PayloadAction<number | undefined>) => {
      action.payload && delete state.dartNight[action.payload];
    },
    addTournament: (
      state,
      action: PayloadAction<{ dartNight: number; tournament: DartTournament }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        dartNight.tournaments.push(action.payload.tournament);
      }
    },
    removeTournament: (
      state,
      action: PayloadAction<{ dartNight: number; tournament: DartTournament }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        dartNight.tournaments = dartNight.tournaments.filter(
          (dt) => dt.id !== action.payload.tournament.id
        );
      }
    },
    setTournamentGames: (
      state,
      action: PayloadAction<{
        dartNight: number;
        tournamentId: number;
        games: DartGame[];
      }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        const tournament = dartNight.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );
        if (tournament) {
          tournament.games = action.payload.games;
        }
      }
    },
    startGame: (
      state,
      action: PayloadAction<{ dartNight: number; tournamentId: number }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNight];
      if (dartNight) {
        const tournament = dartNight.tournaments.find(
          (t) => t.id === action.payload.tournamentId
        );
        if (tournament) {
          const upcoming = tournament.games.find((g) => g.state === "UPCOMING");
          if (upcoming) {
            upcoming.state = "RUNNING";
          }
        }
      }
    },
    setGame: (state, action: PayloadAction<DartGame>) => {
      const game = action.payload;
      if (game.players.every((p) => p.finishRank > 0)) {
        game.state = "FINISHED";
      }
      const dartNight = state.dartNight[game.dartNightId ?? 0];
      if (dartNight) {
        const tournament = dartNight.tournaments.find(
          (t) => t.id === game.dartTournamentId
        );
        if (tournament) {
          const activeGame = tournament.games.find(
            (g) => g.state === "RUNNING"
          );
          if (activeGame) {
            tournament.games[tournament.games.indexOf(activeGame)] = game;
          }
        } else {
          const index = dartNight.games.findIndex(
            (g) => g.sequence === game.sequence
          );
          if (index != -1) {
            dartNight.games[index] = game;
          }
        }
      } else {
        state.fastGame = game;
      }
    },
    addGame: (state, action: PayloadAction<DartGame>) => {
      const game = action.payload;
      const dartNight = state.dartNight[game.dartNightId ?? 0];
      if (dartNight) {
        dartNight.games.push(game);
      }
    },
    changeSettings: (
      state,
      action: PayloadAction<{
        dartNightId: number;
        settings: DartNightSettings;
      }>
    ) => {
      const dartNight = state.dartNight[action.payload.dartNightId];
      if (dartNight) {
        dartNight.settings = action.payload.settings;
      }
    },
  },
});

export const dartConnector = connect(
  (state: RootState) => ({
    dPlayers: state.dart.players,
    dartNights: state.dart.dartNight,
    fastGame: state.dart.fastGame,
    fastGameHistory: state.dart.fastGameHistory,
  }),
  { ...dartSlice.actions },
  undefined,
  {
    areStatesEqual(nextState, prevState) {
      return nextState.dart == prevState.dart;
    },
  }
);

export type DartStoreProps = ConnectedProps<typeof dartConnector>;

export default dartSlice.reducer;
