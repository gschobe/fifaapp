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
        flex: 1,
        maxHeight: "30%",
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
          fontSize: "6vh",
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
          width: "15%",
          display: "flex",
          flexDirection: "row",
          fontSize: "7vh",
          fontWeight: "bold",
          borderStyle: "solid",
          borderWidth: "0px 0px 0px 2px",
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
          display: "flex",
          flexDirection: "column",
          borderStyle: "solid",
          borderWidth: "0px 0px 0px 2px",
        }}
      >
        <div
          style={{
            flex: 0.5,
            display: "flex",
            flexDirection: "row",
            fontSize: "4vh",
            backgroundColor:
              player.finishRank === 0 && player.active
                ? "lightblue"
                : "inherit",
          }}
        >
          {threeDartScore.map((s, idx) => (
            <div
              key={idx}
              style={{
                flex: 0.5,
                textAlign: "center",
                verticalAlign: "middle",
                display: "table-cell",
                lineHeight: "7vh",
                // borderStyle: "solid",
                // borderWidth: "2px 0px 0px 0px",
              }}
            >
              {threeDartScore[idx]}
            </div>
          ))}
          <div
            style={{
              width: "100px",
              textAlign: "center",
              verticalAlign: "middle",
              display: "table-cell",
              lineHeight: "7vh",
              fontSize: "4vh",
            }}
          >
            {player.score.tries.length}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            fontSize: "5vh",
            lineHeight: "7vh",
          }}
        >
          {Array.from(hits.entries()).map((s, idx) => (
            <div
              key={idx}
              style={{
                flex: 0.75,
                textAlign: "center",
                verticalAlign: "middle",
                display: "table-cell",
                borderStyle: "solid",
                borderWidth: "2px 1px 0px 0px",
                backgroundColor: s[1] === 3 ? "lightgreen" : "inherit",
              }}
            >
              {s[0]}
            </div>
          ))}
        </div>
        <div
          style={{
            flex: 1,
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
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                borderStyle: "solid",
                borderWidth: "2px 1px 0px 0px",
                backgroundColor: s === 3 ? "lightgreen" : "inherit",
              }}
            >
              {s < 3 && (
                <>
                  <div style={{ flex: 0.5 }} />
                  <div
                    style={{
                      borderRadius: "50%",
                      width: "4.5vh",
                      height: "4.5vh",
                      backgroundColor: s > 0 ? "darkorange" : "inherit",
                    }}
                  />
                  <div style={{ flex: 0.3 }} />
                  <div
                    style={{
                      // margin: "10% 0",
                      borderRadius: "50%",
                      width: "4.5vh",
                      height: "4.5vh",
                      backgroundColor: s > 1 ? "darkorange" : "inherit",
                    }}
                  />
                  <div style={{ flex: 0.3 }} />
                  {/* <div
                    style={{
                      margin: "10% 0",
                      borderRadius: "50%",
                      flex: 1,
                      backgroundColor: s > 2 ? "darkorange" : "inherit",
                    }}
                  />
                  <div style={{ flex: 0.5 }} /> */}
                </>
              )}
              {/* {s === 0 ? "-" : s === 1 ? "/" : s === 2 ? "X" : "⦻"} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerScoreCricket;
