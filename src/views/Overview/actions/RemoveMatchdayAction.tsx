import Dialog from "@material-ui/core/Dialog";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button, DialogActions } from "@mui/material";
import React from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";

export interface RemoveProps {
  matchDayId?: string;
}

const RemoveMatchdayAction: React.FC<RemoveProps & MatchDayStoreProps> = ({
  matchDayId,
  deleteMatchDay,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleDelete = () => {
    if (matchDayId) {
      deleteMatchDay(matchDayId);
    }
    setOpen(false);
  };
  const onClick = () => {
    setOpen((open) => !open);
  };
  return (
    <>
      <Dialog open={open}>
        <DialogTitle>Delete Matchday</DialogTitle>
        <DialogContentText
          style={{ padding: "20px", fontWeight: "bold", color: "red" }}
        >{`Do you realy want to delete matchday ${matchDayId}?`}</DialogContentText>
        <DialogActions>
          <Button onClick={onClick}>Cancel</Button>
          <Button onClick={handleDelete} variant="contained" color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Button onClick={onClick}>Delete</Button>
    </>
  );
};

export default matchDayConnector(RemoveMatchdayAction);
