import { ShooterGame, ShooterPlayer } from "dart/Definitions";
import { getCurrentRoundDarts } from "dart/utils/DartUtil";
import React from "react";
import _ from "lodash";
import { Divider } from "@mui/material";

interface Props {
  player: ShooterPlayer;
  game: ShooterGame;
}
const PlayerScoreShooter: React.FC<Props> = ({ player, game }) => {
  const points = _.sumBy(player.score.tries, "points");
  const settings = game.settings;
  const currentRoundDarts = getCurrentRoundDarts(game.round, player);
  const threeDartScore: (number | string)[] = currentRoundDarts.map(
    (t) => t.score
  );
  while (threeDartScore.length < 3) {
    threeDartScore.push("-");
  }
  return (
    <div
      id="ShooterScoreBoard"
      style={{
        maxHeight: "30%",
        display: "flex",
        flex: 1,
        overflow: "hidden",
        flexDirection: "row",
        border: "solid 2px",
        borderRadius: "5px",
        backgroundColor: player.finishRank !== 0 ? "lightgreen" : "inherit",
      }}
    >
      <div
        id="player"
        style={{
          display: "flex",
          fontWeight: "bold",
          fontSize: "6vh",
          width: "30%",
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
          }}
        >
          {player.team.name}
        </div>
      </div>
      <div
        style={{
          height: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderStyle: "solid",
          borderWidth: "0px 0px 0px 2px",
        }}
      >
        <div
          style={{
            flex: 2,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            verticalAlign: "middle",
            fontWeight: "bold",
            lineHeight: "7vh",
            fontSize: "5vh",
            width: "100%",
            height: "100%",
          }}
        >
          {settings.legs > 1 && (
            <div
              style={{
                height: "100%",
                lineHeight: "50%",
                padding: "10px",
                fontSize: "24px",
                borderStyle: "solid",
                borderWidth: "0px 2px 0px 0px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <div>{player.legsWon}</div>
              <Divider />
              <div>{player.setsWon}</div>
            </div>
          )}
          <div
            style={{
              width: "40%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              borderStyle: "solid",
              borderWidth: "0 2px 0 0",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <div
              style={{
                height: "4vh",
                lineHeight: "4vh",
                fontSize: "3.5vh",
                fontWeight: "normal",
              }}
            >
              Punkte
            </div>
            <div
              style={{
                height: "14vh",
                textAlign: "right",
                fontSize: "8vh",
                lineHeight: "100%",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div>{points}</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
            {player.finishRank ? (
              <div
                style={{
                  flex: 0.5,
                  textAlign: "center",
                  verticalAlign: "middle",
                  display: "table-cell",
                  fontSize: "7vh",
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
                  : player.score.openNumbers[0]}
              </div>
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  fontWeight: "normal",
                  fontSize: "3vh",
                }}
              >
                {threeDartScore.map((tds, idx) => (
                  <div key={idx} style={{ flex: 1 }}>
                    {tds}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerScoreShooter;
