/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction, Dictionary } from "@reduxjs/toolkit";
import { Game, MatchDay, TournamentTeam } from "../definitions/Definitions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./Store";

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
    setTournamentTeams: (
      state,
      action: PayloadAction<{
        matchdayId: string;
        tournamentId: string;
        tTeams: TournamentTeam[];
        games: Game[];
      }>
    ) => {
      const tournament = state.matchDays[
        action.payload.matchdayId
      ]?.tournaments.find((t) => t.id === action.payload.tournamentId);

      if (tournament) {
        tournament.tournamentTeams = action.payload.tTeams;
        tournament.games = action.payload.games;
      }
    },
  },
});

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
