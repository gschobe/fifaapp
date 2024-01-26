/* eslint-disable no-debugger */
import { Dictionary, PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ATCGame,
  CricketGame,
  DPlayer,
  DartNight,
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
}

const initialState: DartState = {
  players: {},
  dartNight: {},
  fastGame: undefined,
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
      state.fastGame = action.payload;
    },
    addDartNight: (state, action: PayloadAction<DartNight>) => {
      state.dartNight[action.payload.id] = action.payload;
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
    setTournamentGames: (
      state,
      action: PayloadAction<{
        dartNight: number;
        tournamentId: number;
        games: (X01Game | CricketGame | ATCGame)[];
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
      if (game) {
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
          }
        } else {
          state.fastGame = game;
        }
      }
    },
  },
});

export const dartConnector = connect(
  (state: RootState) => ({
    dPlayers: state.dart.players,
    dartNights: state.dart.dartNight,
    fastGame: state.dart.fastGame,
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
