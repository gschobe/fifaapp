import React from "react";
import _ from "lodash";
import { X01Player } from "dart/Definitions";
import { getNumDartsThrown, getPossibleOuts } from "dart/DartUtil";

interface Props {
  player: X01Player;
}
const PlayerScoreX01: React.FC<Props> = ({ player }) => {
  const threeDartScore =
    player.score.threeDartScore[player.score.threeDartScore.length - 1];
  const possibleOuts = getPossibleOuts(player.score.remaining);
  const possible = possibleOuts ? possibleOuts[0] : "";
  return (
    <div
      id="X01ScoreBoard"
      style={{
        display: "flex",
        flexDirection: "row",
        border: "solid 2px",
        backgroundColor:
          player.score.remaining === 0 ? "lightgreen" : "inherit",
      }}
    >
      <div
        id="player"
        style={{
          textAlign: "center",
          verticalAlign: "middle",
          display: "table-cell",
          fontWeight: "bold",
          fontSize: "20px",
          width: "20%",
          height: "100%",
          backgroundColor: player.active ? "lightblue" : "inherit",
        }}
      >
        <div style={{ padding: 2 }}>{player.name}</div>
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
              {player.score.remaining ||
                `${player.finishRank}${
                  player.finishRank === 1
                    ? "st"
                    : player.finishRank === 2
                    ? "nd"
                    : player.finishRank === 3
                    ? "rd"
                    : "th"
                }`}
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
              {possible}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              verticalAlign: "middle",
              // fontWeight: "bold",
              display: "table-cell",
              lineHeight: "7vh",
              fontSize: "4vh",
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
              fontSize: "4vh",
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
