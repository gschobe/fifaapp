import React from "react";
import { useParams } from "react-router-dom";
import MatchdayView from "./MatchdayView";

const RoutingMatchday = () => {
  const params = useParams();
  const id = params.matchdayId;
  return <MatchdayView id={id} />;
};

export default RoutingMatchday;
