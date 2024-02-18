import { DartNight } from "dart/Definitions";
import _ from "lodash";
import React from "react";

interface Props {
  dartNight: DartNight;
}
const DartNightSingleGameChart: React.FC<Props> = ({ dartNight }) => {
  const rankings = dartNight.players.map((p) => {
    return {
      player: p.name,
      ranks: dartNight.games.map((g) => {
        const player = g.players.find((pl) => pl.team.name === p.name);
        return { game: g.type, rank: player?.finishRank };
      }),
    };
  });

  return (
    <div
      style={{
        width: "fit-content",
        display: "flex",
        flexDirection: "row",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "3px 3px 5px gray",
        border: "solid gray",
        borderWidth: "1px ",
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
            display: "flex",
            flexDirection: "column",
            border: "solid gray",
            borderWidth: "0 1px 1px 0",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Spieler
          </div>
          {rankings.map((p) => (
            <div
              key={p.player}
              style={{
                paddingLeft: 3,
                minWidth: "80px",
                border: "solid gray",
                borderWidth: "1px 0 0px 0",
                display: "flex",
                flexDirection: "row",
              }}
            >
              {p.player}
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "50px",
            border: "solid gray",
            borderWidth: "0 1px 1px 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            €
          </div>
          {rankings.map((ranking, idx) => {
            const money = _.sum(
              ranking.ranks.map(
                (r) =>
                  dartNight.settings.money.find((m) => m.rank === r.rank)?.money
              )
            );
            return (
              <div
                key={`money-${idx}`}
                style={{
                  border: "solid gray",
                  borderWidth: "1px 0 0px 0",
                  color: money > 0 ? "green" : money < 0 ? "red" : "inherit",
                }}
              >
                {money ?? 0}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "50px",
            border: "solid gray",
            borderWidth: "0 1px 1px 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Pkt
          </div>
          {rankings.map((ranking, idx) => {
            const money = _.sum(
              ranking.ranks.map(
                (r) =>
                  dartNight.settings.money.find((m) => m.rank === r.rank)
                    ?.points ?? 0
              )
            );
            return (
              <div
                key={`money-${idx}`}
                style={{
                  border: "solid gray",
                  borderWidth: "1px 0 0px 0",
                  color: money > 0 ? "green" : money < 0 ? "red" : "inherit",
                }}
              >
                {money}
              </div>
            );
          })}
        </div>
        {rankings[0].ranks.map((r, idx) => (
          <div
            key={`game-${idx}`}
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "60pt",
              textAlign: "center",
            }}
          >
            <div
              style={{
                border: "solid gray",
                borderWidth: "0px 1px 0px 0px",
                fontWeight: "bold",
              }}
            >
              {r.game}
            </div>
            {rankings.map((ranking) => {
              const finishRank = ranking.ranks[idx].rank ?? -1;
              return (
                <div
                  key={idx}
                  style={{
                    fontWeight: "bold",
                    border: "solid gray",
                    borderWidth: "1px 1px 0px 0px",
                    backgroundColor:
                      finishRank === 1
                        ? "rgb(22 163 74)"
                        : finishRank === 2
                        ? "rgb(134 239 172)"
                        : finishRank > 2 &&
                          finishRank === dartNight.players.length - 1
                        ? "rgb(252 165 165)"
                        : finishRank === dartNight.players.length
                        ? "rgb(239 68 68)"
                        : "inherit",
                  }}
                >
                  {ranking.ranks[idx].rank}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DartNightSingleGameChart;
