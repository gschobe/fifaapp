import { DartNight } from "dart/Definitions";
import _ from "lodash";
import React from "react";

interface Props {
  dartNight: DartNight;
}
const DartNightSingleGameChart: React.FC<Props> = ({ dartNight }) => {
  console.log(dartNight);
  const rankings = dartNight.players.map((p) => {
    return {
      player: p.name,
      ranks: dartNight.games.map((g) => {
        const gameplayers =
          g.players.length > 0 ? g.players : g.finishedPlayers;
        const player = gameplayers.find((pl) => pl.team.name === p.name);
        console.log(player, g.players);
        return { game: g.type, rank: player?.finishRank };
      }),
    };
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
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
          fontSize: "4vh",
          lineHeight: "6vh",
          fontWeight: "bold",
        }}
      >
        <div style={{ width: "140px", padding: "0 10px" }}>Spieler</div>
        <div style={{ border: "solid gray", borderWidth: "0 1px 0 0" }}></div>
        <div style={{ padding: "0 10px", width: "40px" }}>€</div>
        <div style={{ border: "solid gray", borderWidth: "0 1px 0 0" }}></div>
        <div style={{ padding: "0 10px", width: "40px" }}>P</div>
        <div style={{ border: "solid gray", borderWidth: "0 1px 0 0" }}></div>
        {dartNight.games.map((g, idx) => (
          <>
            <div
              key={`${idx}-${g.type}`}
              style={{ flex: 1, textAlign: "center" }}
            >
              {g.type.substring(0, 3).toUpperCase()}
            </div>
            <div style={{ border: "solid gray", borderWidth: "0 1px 0 0 " }} />
          </>
        ))}
      </div>
      {rankings.map((r, idx) => {
        const money = _.sum(
          r.ranks.map(
            (r) =>
              dartNight.settings.money.find((m) => m.rank === r.rank)?.money
          )
        );
        const points = _.sum(
          r.ranks.map(
            (r) =>
              dartNight.settings.money.find((m) => m.rank === r.rank)?.points ??
              0
          )
        );
        return (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "row",
              fontSize: "3.5vh",
              lineHeight: "5vh",
              border: "solid gray",
              borderWidth: "2px 0 0 0",
            }}
          >
            <div style={{ width: "140px", padding: "0 10px" }}>{r.player}</div>
            <div
              style={{ border: "solid gray", borderWidth: "0 1px 0 0" }}
            ></div>
            <div
              style={{
                padding: "0 10px",
                width: "40px",
                color: money > 0 ? "green" : money < 0 ? "red" : "inherit",
              }}
            >
              {money}
            </div>
            <div
              style={{ border: "solid gray", borderWidth: "0 1px 0 0" }}
            ></div>
            <div style={{ padding: "0 10px", width: "40px" }}>{points}</div>
            <div
              style={{ border: "solid gray", borderWidth: "0 1px 0 0" }}
            ></div>
            {r.ranks.map((rank, idx) => (
              <>
                <div
                  key={`${idx}-rank`}
                  style={{
                    flex: 1,
                    fontWeight: "bold",
                    color: "darkblue",
                    textAlign: "center",
                    backgroundColor:
                      rank.rank === 1
                        ? "green"
                        : rank.rank === 2
                        ? "lightgreen"
                        : rank.rank > 2 &&
                          rank.rank === dartNight.players.length - 1
                        ? "orange"
                        : rank.rank === dartNight.players.length
                        ? "red"
                        : "inherit",
                  }}
                >
                  {rank.rank}
                </div>
                <div
                  style={{ border: "solid gray", borderWidth: "0 1px 0 0 " }}
                />
              </>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default DartNightSingleGameChart;
