import React, { ReactNode } from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import { storeConnector, StoreProps } from "store/StoreReducer";
import { calulateOverallStats } from "utils/TableUtils";
import matchData from "../../assets/data/matchData1.json";

interface Props {
  children?: ReactNode[];
}
const DefaultDataProvider: React.FC<
  Props & MatchDayStoreProps & StoreProps
> = ({ children, addMatchDays, matchDays, player, setPlayers }) => {
  React.useEffect(() => {
    console.log("add matchdays");
    addMatchDays(matchData);
  }, [matchData]);
  React.useEffect(() => {
    console.log("calc player stats");
    setPlayers(
      calulateOverallStats(Object.values(matchDays), Object.values(player))
    );
  }, [matchDays]);

  return <>{children}</>;
};

export default storeConnector(matchDayConnector(DefaultDataProvider));
