import { Delete } from "@material-ui/icons";
import { Button, IconButton } from "@mui/material";
import React from "react";
import { DartGame, DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  game: DartGame;
  open: () => void;
}
const DartGameItem: React.FC<Props> = ({ game, open, removeGame }) => {
  return (
    <div
      id="fastgame-infos"
      style={{
        padding: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: "solid 1px",
        borderRadius: "10px",
        marginBottom: 5,
        boxShadow: "3px 3px 2px gray",
      }}
    >
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          rowGap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            fontSize: "2vh",
            lineHeight: "3vh",
            rowGap: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "20%",
            }}
          >
            <div style={{ textAlign: "start" }}>Status:</div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "2.5vh",
                color: game.state === "FINISHED" ? "green" : "blue",
              }}
            >
              {game.state}
            </div>
          </div>
          <div
            style={{
              width: "15%",
              display: "flex",
              flexDirection: "column",
              columnGap: 10,
            }}
          >
            <div style={{ textAlign: "start" }}>Spieltyp:</div>
            <div style={{ fontWeight: "bold", fontSize: "2.5vh" }}>
              {game.type}
            </div>
          </div>
          <div
            style={{ width: "20%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ textAlign: "start" }}>Aktuelle Runde:</div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "2.5vh",
              }}
            >
              {game.round}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ textAlign: "start" }}>Spieler:</div>
            <div style={{ fontWeight: "normal", fontSize: "2.5vh" }}>
              {game.players
                .map(
                  (p) =>
                    `${p.team.name}${
                      p.finishRank !== 0 ? ` (${p.finishRank})` : ""
                    }`
                )
                .join(", ")}
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "160px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
          columnGap: 5,
        }}
      >
        {game.state !== "FINISHED" && (
          <IconButton onClick={() => removeGame(game)}>
            <Delete />
          </IconButton>
        )}

        <Button
          sx={{ width: "120px" }}
          variant="contained"
          color={game.state == "FINISHED" ? "success" : "info"}
          onClick={() => open()}
        >
          {game.state === "FINISHED" ? "ansehen" : "fortsetzen"}
        </Button>
      </div>
    </div>
  );
};

export default dartConnector(DartGameItem);
