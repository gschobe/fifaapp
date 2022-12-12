/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction, Dictionary } from "@reduxjs/toolkit";
import { Player, Team } from "../definitions/Definitions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./Store";

export interface StoreState {
  players: Dictionary<Player>;
  teams: Team[];
}

const initialState: StoreState = {
  players: {},
  teams: [],
};

export const storeSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<string>) => {
      state.players[action.payload] = {
        name: action.payload,
        stats: {
          gamesPlayed: 0,
          gamesLost: 0,
          gamesTie: 0,
          gamesWon: 0,
          goalsScored: 0,
          goalsAgainst: 0,
        },
      };
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
  },
});

export const storeConnector = connect(
  (state: RootState) => ({
    player: state.fifadata.players,
    teams: state.fifadata.teams,
  }),
  { ...storeSlice.actions },
  undefined,
  {
    areStatesEqual(nextState, prevState) {
      return nextState.fifadata == prevState.fifadata;
    },
  }
);

export type StoreProps = ConnectedProps<typeof storeConnector>;

export default storeSlice.reducer;
