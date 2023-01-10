import React, { ReactNode } from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import matchData from "../../assets/data/matchData1.json";

interface Props {
  children?: ReactNode[];
}
const DefaultDataProvider: React.FC<Props & MatchDayStoreProps> = ({
  children,
  addMatchDays,
}) => {
  addMatchDays(matchData);
  return <>{children}</>;
};

export default matchDayConnector(DefaultDataProvider);
