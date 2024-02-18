import { Delete } from "@material-ui/icons";
import { IconButton } from "@mui/material";
import { DeleteModal } from "dart/DartHome";
import { DartNight } from "dart/Definitions";
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  dn?: DartNight;
  dartNight: (DartNight | undefined)[];
  open: () => void;
}
const DartNightItem: React.FC<Props> = ({
  dn,
  dartNight,
  open,
  removeDartNight,
}) => {
  const [deleteOpen, setDeleteOpen] = React.useState(false);
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
        boxShadow: "3px 3px 5px gray",
      }}
      onClick={() => open()}
    >
      <DeleteModal
        open={deleteOpen}
        close={() => setDeleteOpen(false)}
        remove={() => removeDartNight(dn?.id)}
      />
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
        <div style={{ minWidth: "fit-content" }}>
          {`# Players: ${dn?.players.length}`}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ minWidth: "fit-content" }}>
          {`Created at: ${new Date(dn?.id ?? new Date()).toLocaleDateString(
            "de-DE"
          )}`}
        </div>
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            setDeleteOpen(true);
          }}
        >
          <Delete />
        </IconButton>
      </div>
    </div>
  );
};

export default dartConnector(DartNightItem);
