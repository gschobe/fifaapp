import { DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Button, Dialog, IconButton } from "@mui/material";
import { DartTournament } from "dart/Definitions";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  id: number;
  dt: DartTournament;
  setSelectedTournament: (dt: DartTournament | undefined) => void;
  removeTournament: (dt: DartTournament) => void;
}
const TournamentItem: React.FC<Props> = ({
  id,
  dt,
  setSelectedTournament,
  removeTournament,
}) => {
  const navigate = useNavigate();
  const loc = useLocation();

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
      onClick={() => {
        setSelectedTournament(dt);
        navigate(`${loc.pathname}/${dt?.id}`);
      }}
    >
      <DeleteModal
        open={deleteOpen}
        close={() => setDeleteOpen(false)}
        remove={() => removeTournament(dt)}
      />
      <div
        id="TournamentHeader"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          columnGap: "20px",
          height: "100%",
          lineHeight: "100%",
          alignItems: "center",
          textAlign: "center",
          padding: "0px 5px 0px 10px",
        }}
      >
        <div style={{ minWidth: "fit-content", fontWeight: "bold" }}>
          {`ID: ${id}`}
        </div>
        <div
          style={{
            minWidth: "fit-content",
            fontWeight: "bold",
            color:
              dt?.state === "NEW"
                ? "green"
                : dt?.state === "RUNNING"
                ? "orange"
                : "blue",
          }}
        >{`${dt?.state}`}</div>
        <div style={{ minWidth: "fit-content" }}>
          {`${dt?.gameSettings.choosenGame} / ${dt?.tournamentSettings.mode}`}
        </div>
        {/* <div style={{ minWidth: "fit-content" }}>
          {`# Players: ${dt?.teams.flatMap((t) => t.players).length}`}
        </div> */}
        <div style={{ flex: 1 }}></div>
        <div style={{ minWidth: "fit-content" }}>
          {`Created at: ${new Date(dt?.id ?? new Date()).toLocaleDateString(
            "de-DE"
          )}`}
        </div>
        <div style={{ minWidth: "fit-content" }}>
          {dt?.started ? `Started at: ${new Date(dt?.started)}` : ""}
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

export default TournamentItem;

const DeleteModal: React.FC<{
  open: boolean;
  close: () => void;
  remove: () => void;
}> = ({ open, close, remove }) => {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Tournament löschen?</DialogTitle>
      <DialogContent>Willst du das Tournament wirklich löschen?</DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            remove();
          }}
        >
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
