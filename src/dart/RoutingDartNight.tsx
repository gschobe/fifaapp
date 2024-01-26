import React from "react";
import { useParams } from "react-router-dom";
import DartNightView from "./DartNightView";

const RoutingDartNight = () => {
  const params = useParams();
  const id = params.dartNightId;
  return <DartNightView id={Number(id)} />;
};

export default RoutingDartNight;
