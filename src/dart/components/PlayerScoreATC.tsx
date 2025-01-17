import React from "react";
import { ATCGame, ATCPlayer } from "dart/Definitions";

interface Props {
  player: ATCPlayer;
  game: ATCGame;
}
const PlayerScoreATC: React.FC<Props> = ({ player }) => {
  console.log(player);
  return (
    <div
      id="ATCScoreBoard"
      style={{
        display: "flex",
        flex: 1,
        maxHeight: "30%",
        overflow: "hidden",
        flexDirection: "row",
        border: "solid 2px",
        borderRadius: "5px",
        backgroundColor: player.finishRank !== 0 ? "lightgreen" : "inherit",
        boxShadow: "3px 3px 5px grey",
      }}
    >
      <div
        id="player"
        style={{
          overflow: "auto",
          display: "flex",
          fontWeight: "bold",
          fontSize: `7vh`,
          width: "20%",
          height: "100%",
          backgroundColor:
            player.finishRank === 0 && player.active ? "lightblue" : "inherit",
        }}
      >
        <div
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "auto",
            lineHeight: "100%",
            minWidth: "fit-content",
          }}
        >
          {player.team.name}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderStyle: "solid",
          borderWidth: "0px 0px 0px 2px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
          }}
        >
          <div
            style={{
              flex: 2,
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              lineHeight: "7vh",
              fontSize: "8vh",
            }}
          >
            <div
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                height: "auto",
                lineHeight: "100%",
              }}
            >
              {player.finishRank
                ? `${player.finishRank}${
                    player.finishRank === 1
                      ? "st"
                      : player.finishRank === 2
                      ? "nd"
                      : player.finishRank === 3
                      ? "rd"
                      : "th"
                  }`
                : Array.from(player.score.hits?.entries()).filter(
                    (e) => e[1] === undefined
                  )?.[0][0]}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              height: "auto",
              fontSize: "6vh",
              lineHeight: "100%",
            }}
          >
            {player.dartsThrown}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerScoreATC;
