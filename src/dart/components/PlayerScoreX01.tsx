import React from "react";
import _ from "lodash";
import { X01Player } from "dart/Definitions";
import {
  getCurrentRoundDarts,
  getNumDartsThrown,
  getPossibleOuts,
} from "dart/utils/DartUtil";

interface Props {
  player: X01Player;
  round: number;
}
const PlayerScoreX01: React.FC<Props> = ({ player, round }) => {
  const displayRound =
    player.active || player.finishRank > 0 || round === 1 ? round : round - 1;
  const currentRoundDarts = getCurrentRoundDarts(displayRound, player);
  const threeDartScore: (number | string)[] = currentRoundDarts.map(
    (t) => t.points
  );
  while (threeDartScore.length < 3) {
    threeDartScore.push("-");
  }
  const possibleOuts = getPossibleOuts(player.score.remaining);
  const possible = possibleOuts ? possibleOuts[0] : "";
  return (
    <div
      id="X01ScoreBoard"
      style={{
        display: "flex",
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
          fontSize: "4.5vh",
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
              //   display: "table-cell",
              lineHeight: "7vh",
              fontSize: "5vh",
            }}
          >
            <div
              style={{
                flex: 1,
                textAlign: "center",
                verticalAlign: "middle",
                display: "table-cell",
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
                : player.score.remaining}
            </div>
            <div
              style={{
                flex: 1.5,
                textAlign: "center",
                verticalAlign: "middle",
                display: "table-cell",
                fontWeight: "normal",
                lineHeight: "7vh",
                fontSize: "3.5vh",
              }}
            >
              {player.finishRank ? "" : possible}
            </div>
          </div>
          <div
            style={{
              flex: 0.5,
              textAlign: "center",
              verticalAlign: "middle",
              // fontWeight: "bold",
              display: "table-cell",
              lineHeight: "7vh",
              fontSize: "3.5vh",
            }}
          >
            {getNumDartsThrown(player)}
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              display: "table-cell",
              lineHeight: "7vh",
              fontSize: "3.5vh",
            }}
          >
            {`Ø ${player.score.average}`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            lineHeight: "5vh",
            fontSize: "3.5vh",
          }}
        >
          {threeDartScore.map((s, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                textAlign: "center",
                verticalAlign: "middle",
                display: "table-cell",
                borderStyle: "solid",
                borderWidth: "2px 0px 0px 0px",
              }}
            >
              {threeDartScore[idx]}
            </div>
          ))}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
              display: "table-cell",
              lineHeight: "5vh",
              fontSize: "3.5vh",
              borderStyle: "solid",
              borderWidth: "2px 0px 0px 0px",
            }}
          >
            {_.sum(threeDartScore).toString().split("-")[0]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerScoreX01;
