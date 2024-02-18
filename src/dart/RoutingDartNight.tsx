import React from "react";
import { useParams } from "react-router-dom";
import DartNightView from "./DartNightView";
import DartNightTournamenView from "./DartNightTournamenView";

const RoutingDartNight = () => {
  const params = useParams();
  const id = params.dartNightId;
  const dtId = params.dartTournamentId;
  if (dtId) {
    return <DartNightTournamenView dnId={Number(id)} dtId={Number(dtId)} />;
  } else {
    return <DartNightView id={Number(id)} />;
  }
};

export default RoutingDartNight;
