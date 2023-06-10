import React, { ReactNode } from "react";
import { addMatchDays, MatchDayStoreProps } from "store/FifaGamesReducer";
import { AppDispatch } from "store/Store";
import { storeConnector, StoreProps } from "store/StoreReducer";
import { calulateOverallStats } from "utils/TableUtils";
import matchData from "../../assets/data/matchData1.json";

interface Props {
  dispatch: AppDispatch;
  children?: ReactNode[];
}
const DefaultDataProvider: React.FC<
  Props & MatchDayStoreProps & StoreProps
> = ({ children, dispatch, matchDays, player, setPlayers }) => {
  React.useEffect(() => {
    console.log("add matchdays");
    dispatch(addMatchDays(matchData));
  }, [matchData]);
  React.useEffect(() => {
    console.log("calc player stats");
    if (matchDays && player) {
      setPlayers(
        calulateOverallStats(Object.values(matchDays), Object.values(player))
      );
    }
  }, [matchDays]);

  return <>{children}</>;
};

export default storeConnector(DefaultDataProvider);
