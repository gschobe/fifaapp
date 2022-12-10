/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction, Dictionary } from "@reduxjs/toolkit";
import { Player, Team } from "../definitions/Definitions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./Store";

export interface StoreState {
  // tourSimulations: Dictionary<TourSimulation>;
  players: Dictionary<Player>;
  teams: Team[];
  // tourTasks: TourTask[];
  // tourData: TourData[];
}

const initialState: StoreState = {
  // tourSimulations: {},
  players: {},
  teams: [],
  // tourTasks: [],
  // tourData: [],
};

export const storeSlice = createSlice({
  name: "simulation",
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<string>) => {
      state.players[action.payload] = {
        name: action.payload,
        gamesPlayed: 0,
        gamesLost: 0,
        gamesTie: 0,
        gamesWon: 0,
        goalsScored: 0,
        goalsAgainst: 0,
      };
    },
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
    },
  },
});

export const getPlayers = (state: RootState) => state.fifa.players;

export const storeConnector = connect(
  (state: RootState) => ({
    player: state.fifa.players,
    teams: state.fifa.teams,
  }),
  { ...storeSlice.actions },
  undefined,
  {
    areStatesEqual(nextState, prevState) {
      return nextState.fifa == prevState.fifa;
    },
  }
);

export type StoreProps = ConnectedProps<typeof storeConnector>;

export default storeSlice.reducer;
