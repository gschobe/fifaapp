/* eslint-disable prettier/prettier */
import { createSlice, PayloadAction, Dictionary } from "@reduxjs/toolkit";
import { Player, Team } from "../definitions/Definitions";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./Store";
import _ from "lodash";

export interface StoreState {
  players: Dictionary<Player>;
  teams: Dictionary<Team>;
}

const initialState: StoreState = {
  players: {},
  teams: {},
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
      state.teams = {
        ...state.teams,
        ..._(action.payload)
          .keyBy((team) => team.name)
          .value(),
      };
    },
    updateTeamRating: (
      state,
      action: PayloadAction<{ id: string; rating: number }>
    ) => {
      const team = state.teams[action.payload.id];
      if (team) {
        team.rating = action.payload.rating;
      }
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      state.teams[action.payload.name] = action.payload;
    },
    setPlayers: (state, action: PayloadAction<Dictionary<Player>>) => {
      const newPlayers = action.payload;
      if (newPlayers) {
        Object.values(state.players).forEach((p) => {
          if (p) {
            const stats = newPlayers[p.name]?.stats;
            if (stats) {
              const player = state.players[p.name];
              if (player) {
                player.stats = stats;
              }
            }
          }
        });
      }
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
