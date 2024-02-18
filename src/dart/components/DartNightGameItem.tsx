import React from "react";
import { DartGame } from "store/DartStore";

interface Props {
  id: number;
  game: DartGame;
  setSelectedGame: (dt: DartGame | undefined) => void;
}
const DartNightGameItem: React.FC<Props> = ({ id, game, setSelectedGame }) => {
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
        boxShadow: "3px 3px 5px gray",
      }}
      onClick={() => setSelectedGame(game)}
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
              game.state === "OPEN"
                ? "green"
                : game.state === "RUNNING"
                ? "green"
                : "blue",
          }}
        >{`${game.state}`}</div>
        <div style={{ minWidth: "fit-content" }}>{`${game.type}`}</div>
        {/* <div style={{ minWidth: "fit-content" }}>
          {`# Players: ${dt?.teams.flatMap((t) => t.players).length}`}
        </div> */}
        <div style={{ flex: 1 }}></div>
      </div>
    </div>
  );
};

export default DartNightGameItem;
