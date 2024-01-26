import { DartNight } from "dart/Definitions";
import React from "react";

interface Props {
  dn?: DartNight;
  dartNight: (DartNight | undefined)[];
  open: () => void;
}
const DartNightItem: React.FC<Props> = ({ dn, dartNight, open }) => {
  return (
    <div
      style={{
        cursor: "pointer",
        height: "7vh",
        width: "100%",
        border: "solid 1px black",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        fontSize: "2.8vh",
      }}
      onClick={() => open()}
    >
      <div
        id="TournamentHeader"
        style={{
          display: "flex",
          flexDirection: "row",
          columnGap: "20px",
          height: "100%",
          lineHeight: "100%",
          alignItems: "center",
          textAlign: "center",
          padding: "0px 5px 0px 10px",
        }}
      >
        <div style={{ minWidth: "fit-content", fontWeight: "bold" }}>
          {`ID: ${Object.values(dartNight).indexOf(dn) + 1}`}
        </div>
        <div
          style={{
            minWidth: "fit-content",
            fontWeight: "bold",
            color:
              dn?.state === "NEW"
                ? "green"
                : dn?.state === "RUNNING"
                ? "orange"
                : "blue",
          }}
        >{`${dn?.state}`}</div>
        <div style={{ minWidth: "fit-content" }}>{`${dn?.mode}`}</div>
        <div style={{ minWidth: "fit-content" }}>
          {`# Players: ${dn?.players.length}`}
        </div>
        <div style={{ minWidth: "fit-content" }}>
          {`Created at: ${new Date(dn?.id ?? new Date()).toLocaleDateString(
            "de-DE"
          )}`}
        </div>
      </div>
    </div>
  );
};

export default DartNightItem;
