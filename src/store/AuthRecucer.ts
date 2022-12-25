import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./Store";

export interface AuthState {
  isLoggedIn: boolean;
  username: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  username: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.username = "";
      state.isLoggedIn = false;
    },
  },
});

export const authConnector = connect(
  (state: RootState) => ({
    isLoggedIn: state.auth.isLoggedIn,
    username: state.auth.username,
  }),
  { ...authSlice.actions },
  undefined,
  {
    areStatesEqual(nextState, prevState) {
      return nextState.auth == prevState.auth;
    },
  }
);

export type AuthProps = ConnectedProps<typeof authConnector>;

export default authSlice.reducer;
