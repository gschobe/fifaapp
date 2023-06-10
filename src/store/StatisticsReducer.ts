import { GridRowId } from "@mui/x-data-grid";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "./Store";

export interface StatisticsState {
  selection: GridRowId[];
}

const initialState: StatisticsState = {
  selection: [],
};

export const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<GridRowId[]>) => {
      state.selection = action.payload;
    },
  },
});

export const statisticsConnector = connect(
  (state: RootState) => ({
    selection: state.statistics.selection,
  }),
  { ...statisticsSlice.actions },
  undefined,
  {
    areStatesEqual(nextState, prevState) {
      return nextState.statistics == prevState.statistics;
    },
  }
);

export type StatisticsProps = ConnectedProps<typeof statisticsConnector>;

export default statisticsSlice.reducer;
