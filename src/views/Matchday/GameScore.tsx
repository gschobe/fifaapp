import { TextField } from "@mui/material";
import { Game, TournamentTeam } from "definitions/Definitions";
import React from "react";
import { IconButton } from "@material-ui/core";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";

export const tournamenTeamComp = (
  index: number,
  tt: TournamentTeam,
  direction: "row" | "column" = "row",
  switchTeamAllowed: boolean = false,
  reDrawTeam: (index: number) => void = (index: number) => {
    console.log(index);
  }
) => {
  const redraw = () => {
    reDrawTeam(index);
  };

  return (
    <div
      key={index}
      style={{
        display: "flex",
        flexDirection: direction,
        fontWeight: "bold",
        fontSize: 18,
        margin: "5pt 0",
        width: "100%",
        textAlign: "center",
        justifyContent: "space-evenly",
      }}
    >
      <div
        style={{
          flex: 1,
        }}
      >
        {tt.players.map((p) => p?.name).join(" & ")}
      </div>
      {direction === "row" && (
        <div style={{ flex: 0.1, padding: "0 5pt" }}>{`|`}</div>
      )}
      <div
        style={{
          fontStyle: "italic",
          color: "grey",
          flex: 1,
        }}
      >
        {tt.team?.name}
        {switchTeamAllowed && (
          <IconButton style={{ padding: 0 }} onClick={redraw}>
            <AutorenewRoundedIcon />
          </IconButton>
        )}
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
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {tournamenTeamComp(1, liveGame?.homePlayer, "column")}
        <div style={{ fontWeight: "bolder", fontSize: 20, margin: "0 10pt" }}>
          {"vs"}
        </div>
        {tournamenTeamComp(2, liveGame?.awayPlayer, "column")}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          margin: "5pt 0",
          justifyContent: "space-evenly",
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
              flex: 1,
              width: "60px",
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
            flex: 0.1,
            textAlign: "center",
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
              flex: 1,
              width: "60px",
              textAlign: "center",
              fontSize: 30,
              margin: 0,
              padding: "4px 4px",
            },
          }}
        />
      </div>
    </div>
  );
};
