import { Divider } from "@mui/material";
import { X01Game, X01Player } from "dart/Definitions";
import {
  calculateLegAverage,
  getLatestLeg,
  getPossibleOuts,
  isFinish,
} from "dart/utils/DartUtil";
import _ from "lodash";
import React from "react";

interface Props {
  player: X01Player;
  game: X01Game;
}
const PlayerScoreX01: React.FC<Props> = ({ player, game }) => {
  const latest = getLatestLeg(game);
  const tries = latest.leg?.tries.filter((t) => t.player === player.team.name);
  const numDartThrown = tries?.length ?? 0;

  const currentRoundDarts =
    tries?.slice(numDartThrown - (numDartThrown % 3)).map((t) => t.try) ?? [];

  const legAverage = calculateLegAverage(player, latest.leg);

  const pointsThrown = _.sumBy(
    tries?.filter((t) => !["MISS", "BUST"].includes(t.try.score)),
    (t) => t.try.points
  );
  const remaining = game.settings.kind - pointsThrown;
  const settings = game.settings;
  const roundStartPoints =
    remaining +
    (player.score.tries.length % 3 === 0
      ? 0
      : _.sumBy(currentRoundDarts, "points"));
  const finishAtStart = isFinish(roundStartPoints);
  const threeDartScore: (number | string)[] = currentRoundDarts.map(
    (t) => t.points
  );
  while (threeDartScore.length < 3) {
    threeDartScore.push("-");
  }
  const possibleOuts = getPossibleOuts(remaining);
  const possible = finishAtStart && possibleOuts ? possibleOuts[0] : "";
  return (
    <div
      id="X01ScoreBoard"
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
        id="player-points"
        style={{
          overflow: "auto",
          display: "flex",
          flexDirection: "row",
          fontWeight: "bold",
          fontSize: "6vh",
          width: "15%",
          minWidth: "fit-content",
          height: "100%",
          borderStyle: "solid",
          borderWidth: "0px 0px 0px 2px",
        }}
      >
        {settings.legs > 1 && (
          <div
            style={{
              height: "100%",
              // width: "20%",
              fontSize: "24px",
              borderStyle: "solid",
              borderWidth: "0px 2px 0px 0px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-evenly",
              padding: "0 5px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 5,
              }}
            >
              <div style={{ fontSize: 16 }}>{`L`}</div>
              <div>{`${player.legsWon}`}</div>
            </div>
            <Divider />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 5,
              }}
            >
              <div style={{ fontSize: 16 }}>{`S`}</div>
              <div>{`${player.setsWon}`}</div>
            </div>
          </div>
        )}
        <div
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "auto",
            lineHeight: "90%",
            padding: "0 5px",
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
            : remaining}
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
            flex: 1,
            flexDirection: "row",
            fontSize: "5vh",
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
                flex: 1.5,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                lineHeight: "100%",
                padding: "0 5px",
                fontWeight: "bold",
                verticalAlign: "middle",
              }}
            >
              {player.finishRank ? "" : possible}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              lineHeight: "100%",
              padding: "0 5px",
              verticalAlign: "middle",
            }}
          >
            {numDartThrown}
          </div>
          <div
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              lineHeight: "100%",
              padding: "0 5px",
              fontWeight: "bold",
              verticalAlign: "middle",
            }}
          >
            {`Ø ${legAverage}`}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // lineHeight: "5vh",
            fontSize: "5vh",
            flex: 1,
          }}
        >
          {threeDartScore.map((s, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                display: "flex",
                height: "auto",
                lineHeight: "100%",
                padding: "0 5px",
                // fontSize: "180%",
                verticalAlign: "middle",
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
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              height: "auto",
              lineHeight: "100%",
              padding: "0 5px",
              // fontSize: "200%",
              fontWeight: "bold",
              verticalAlign: "middle",
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
