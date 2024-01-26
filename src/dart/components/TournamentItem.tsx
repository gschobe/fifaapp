import { DartTournament } from "dart/Definitions";
import React from "react";

interface Props {
  id: number;
  dt?: DartTournament | undefined;
  setSelectedTournament: (dt: DartTournament | undefined) => void;
}
const TournamentItem: React.FC<Props> = ({ id, dt, setSelectedTournament }) => {
  return (
    <div
      style={{
        cursor: "pointer",
        height: "7vh",
        width: "100%",
        border: "solid 1px black",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        fontSize: "2.8vh",
      }}
      onClick={() => setSelectedTournament(dt)}
    >
      <div
        id="TournamentHeader"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          columnGap: "20px",
          height: "100%",
          lineHeight: "100%",
          alignItems: "center",
          textAlign: "center",
          padding: "0px 5px 0px 10px",
        }}
      >
        <div style={{ minWidth: "fit-content", fontWeight: "bold" }}>
          {`ID: ${id}`}
        </div>
        <div
          style={{
            minWidth: "fit-content",
            fontWeight: "bold",
            color:
              dt?.state === "NEW"
                ? "green"
                : dt?.state === "RUNNING"
                ? "orange"
                : "blue",
          }}
        >{`${dt?.state}`}</div>
        <div style={{ minWidth: "fit-content" }}>
          {`${dt?.gameSettings.choosenGame} / ${dt?.tournamentSettings.mode}`}
        </div>
        {/* <div style={{ minWidth: "fit-content" }}>
          {`# Players: ${dt?.teams.flatMap((t) => t.players).length}`}
        </div> */}
        <div style={{ flex: 1 }}></div>
        <div style={{ minWidth: "fit-content" }}>
          {`Created at: ${new Date(dt?.id ?? new Date()).toLocaleDateString(
            "de-DE"
          )}`}
        </div>
        <div style={{ minWidth: "fit-content" }}>
          {dt?.started ? `Started at: ${new Date(dt?.started)}` : ""}
        </div>
      </div>
    </div>
  );
};

export default TournamentItem;
