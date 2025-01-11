import { DartNight } from "dart/Definitions";
import _ from "lodash";
import React from "react";

interface Props {
  dartNight: DartNight;
}
const DartNightSingleGameChartNew: React.FC<Props> = ({ dartNight }) => {
  console.log(dartNight);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        borderRadius: "10px",
        boxShadow: "3px 3px 5px gray",
        border: "solid gray",
        borderWidth: "1px ",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: "120px" }}>
        <div
          style={{
            padding: "0 10px",
            fontSize: "3.5vh",
            lineHeight: "6vh",
            fontWeight: "bold",
          }}
        >
          Spieler
        </div>
        {dartNight.players.map((p) => (
          <>
            <div
              style={{ border: "solid gray", borderWidth: "1px 1px 0 0" }}
            ></div>
            <div
              key={p.name}
              style={{
                padding: "0 10px",
                fontSize: "2.5vh",
                lineHeight: "4vh",
              }}
            >
              {p.name}
            </div>
          </>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60px",
          textAlign: "center",
          border: "solid gray",
          borderWidth: "0 0 0 1px",
        }}
      >
        <div
          style={{
            padding: "0 10px",
            fontSize: "3.5vh",
            lineHeight: "6vh",
            fontWeight: "bold",
          }}
        >
          €
        </div>
        {dartNight.players.map((p) => {
          const money = _.sum(
            dartNight.games.map((g) => {
              const player = g.players.find((gp) => gp.team.name === p.name);
              return dartNight.settings.money.find(
                (m) => m.rank === player?.finishRank
              )?.money;
            })
          );
          return (
            <>
              <div
                style={{ border: "solid gray", borderWidth: "1px 1px 0 0" }}
              ></div>
              <div
                key={p.name}
                style={{
                  padding: "0 10px",
                  fontSize: "2.5vh",
                  lineHeight: "4vh",
                  textAlign: "right",
                  color: money > 0 ? "green" : money < 0 ? "red" : "inherit",
                }}
              >
                {money}
              </div>
            </>
          );
        })}
      </div>
      <div
        id="points-section"
        style={{
          display: "flex",
          flexDirection: "column",
          width: "60px",
          textAlign: "center",
          border: "solid gray",
          borderWidth: "0 0 0 1px",
        }}
      >
        <div
          style={{
            padding: "0 10px",
            fontSize: "3.5vh",
            lineHeight: "6vh",
            fontWeight: "bold",
          }}
        >
          Pkt
        </div>
        {dartNight.players.map((p) => {
          const points = _.sum(
            dartNight.games.map((g) => {
              const player = g.players.find((gp) => gp.team.name === p.name);
              return dartNight.settings.money.find(
                (m) => m.rank === player?.finishRank
              )?.points;
            })
          );
          return (
            <>
              <div
                style={{ border: "solid gray", borderWidth: "1px 1px 0 0" }}
              ></div>
              <div
                key={p.name}
                style={{
                  padding: "0 10px",
                  fontSize: "2.5vh",
                  lineHeight: "4vh",
                  textAlign: "right",
                }}
              >
                {points}
              </div>
            </>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          overflowX: "auto",
        }}
      >
        {dartNight.games.map((g, idx) => (
          <div
            id="ranking"
            key={`${idx}-${g.type}`}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: "60px",
              border: "solid gray",
              borderWidth: "0 0 0 1px",
            }}
          >
            <div
              style={{
                fontSize: "3.5vh",
                lineHeight: "6vh",
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
              }}
            >
              {g.type.substring(0, 3).toUpperCase()}
            </div>
            {dartNight.players.map((dnp) => {
              const gp = g.players.find((p) => p.team.name === dnp.name);
              const rank = gp?.finishRank ?? 0;
              const bgColor =
                rank === 1
                  ? "#14c70880"
                  : rank === 2 && dartNight.players.length > 3
                  ? "#14c70840"
                  : rank > 1 && rank === dartNight.players.length - 1
                  ? "#f5a10580"
                  : rank === dartNight.players.length
                  ? "#b5121d80"
                  : "inherit";
              return (
                <div
                  key={gp?.team.name}
                  style={{
                    fontSize: "2.5vh",
                    fontWeight: "bold",
                    height: "100%",
                    flex: 1,
                    border: "solid gray",
                    borderWidth: "1px 0 0 0",
                    textAlign: "center",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: bgColor,
                  }}
                >
                  {gp?.finishRank}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DartNightSingleGameChartNew;
