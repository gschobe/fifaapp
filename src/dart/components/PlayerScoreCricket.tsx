import React from "react";
import { CricketGame, CricketPlayer } from "dart/Definitions";
import {
  getCurrentRoundDarts,
  getPlayerPointsCricket,
} from "dart/utils/DartUtil";

interface Props {
  player: CricketPlayer;
  game: CricketGame;
}
const PlayerScoreCricket: React.FC<Props> = ({ player, game }) => {
  const points = getPlayerPointsCricket(
    game.settings.mode,
    player,
    game.players
  );
  const hits = new Map(game.settings.numbers.map((num) => [num, 0]));
  player.score.tries
    .filter((t) => t.number !== 0)
    .forEach((t) => {
      hits.set(t.number, (hits.get(t.number) ?? 0) + t.hits);
    });
  const displayRound =
    player.active || player.finishRank > 0 || game.round === 1
      ? game.round
      : game.round - 1;
  const currentRoundDarts = getCurrentRoundDarts(displayRound, player);
  const threeDartScore: (number | string)[] = currentRoundDarts.map(
    (t) =>
      `${t.multiplier === 3 ? "T" : t.multiplier === 2 ? "D" : ""}${t.number}`
  );
  while (threeDartScore.length < 3) {
    threeDartScore.push("-");
  }
  return (
    <div
      id="CricketScoreBoard"
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
              flex: 1,
              display: "flex",
              flexDirection: "row",
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: "bold",
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
                : points}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              verticalAlign: "middle",
              display: "table-cell",
              lineHeight: "7vh",
              fontSize: "4vh",
            }}
          >
            {player.score.tries.length}
          </div>
          {threeDartScore.map((s, idx) => (
            <div
              key={idx}
              style={{
                flex: 0.5,
                textAlign: "center",
                verticalAlign: "middle",
                display: "table-cell",
                lineHeight: "7vh",
                fontSize: "2.5vh",
                fontWeight: "bold",
                // borderStyle: "solid",
                // borderWidth: "2px 0px 0px 0px",
              }}
            >
              {threeDartScore[idx]}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            lineHeight: "5vh",
            fontSize: "3.5vh",
          }}
        >
          {Array.from(hits.keys()).map((s, idx) => (
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
              {s}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            lineHeight: "5vh",
            fontSize: "3.5vh",
          }}
        >
          {Array.from(hits.values()).map((s, idx) => (
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
              {s === 0 ? "-" : s === 1 ? "/" : s === 2 ? "X" : "⦻"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerScoreCricket;
