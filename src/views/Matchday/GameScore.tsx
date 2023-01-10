import { TextField } from "@mui/material";
import { Game, TournamentTeam } from "definitions/Definitions";
import React from "react";

export const tournamenTeamComp = (index: number, tt: TournamentTeam) => {
  return (
    <div
      key={index}
      style={{
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        fontSize: 18,
        margin: "5pt 0",
        width: "100%",
        textAlign: "center",
        justifyContent: "space-evenly",
      }}
    >
      <div style={{ minWidth: "40%", width: "fit-content" }}>
        {tt.players.map((p) => p?.name).join(" & ")}
      </div>
      <div style={{ padding: "0 5pt" }}>{`|`}</div>
      <div
        style={{
          fontStyle: "italic",
          color: "grey",
          minWidth: "40%",
          width: "fit-content",
        }}
      >
        {tt.team?.name}
      </div>
    </div>
  );
};

export interface GameScoreProps {
  liveGame: Game;
  homeScore: number;
  awayScore: number;
  handleHomeScoreChange: (e: any) => void;
  handleAwayScoreChange: (e: any) => void;
}
export const GameScore: React.FC<GameScoreProps> = ({
  liveGame,
  homeScore,
  awayScore,
  handleHomeScoreChange,
  handleAwayScoreChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {tournamenTeamComp(1, liveGame?.homePlayer)}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: "5pt 0",
        }}
      >
        <TextField
          key={"homeScore"}
          value={homeScore}
          variant="outlined"
          inputMode="numeric"
          onChange={handleHomeScoreChange}
          onFocus={(event) => {
            event.target.select();
          }}
          inputProps={{
            style: {
              width: "40px",
              textAlign: "center",
              fontSize: 30,
              margin: 0,
              padding: "4px 4px",
            },
          }}
        />
        <div
          style={{
            fontWeight: "bolder",
            fontSize: 20,
            margin: "0 10pt",
          }}
        >
          {":"}
        </div>
        <TextField
          key={"awayScore"}
          value={awayScore}
          variant="outlined"
          inputMode="numeric"
          onChange={handleAwayScoreChange}
          onFocus={(event) => {
            event.target.select();
          }}
          inputProps={{
            style: {
              width: "40px",
              textAlign: "center",
              fontSize: 30,
              margin: 0,
              padding: "4px 4px",
            },
          }}
        />
      </div>
      {tournamenTeamComp(2, liveGame?.awayPlayer)}
    </div>
  );
};
