import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import React from "react";
import { X01FinishKind, X01Kind, X01StartKind } from "./Definitions";
import DartOverview from "./DartOverview";
import MenuIcon from "@mui/icons-material/Menu";

const DartHome: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [startScore, setStartScore] = React.useState<X01Kind>(301);
  const [startKind, setStartKind] = React.useState<X01StartKind>("SINGLE IN");
  const [finishKind, setFinishKind] = React.useState<X01FinishKind>(
    "SINGLE OUT"
  );
  const [startGame, setStartGame] = React.useState(false);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Dialog fullWidth open={open}>
        <DialogTitle>Define Game Settings</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", flexDirection: "column", rowGap: 10 }}>
            <ToggleButtonGroup
              color="info"
              exclusive
              fullWidth
              value={startScore}
              onChange={(_event, value) => setStartScore(value)}
            >
              <ToggleButton value={301}>301</ToggleButton>
              <ToggleButton value={501}>501</ToggleButton>
              <ToggleButton value={701}>701</ToggleButton>
              <ToggleButton value={901}>901</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              color="info"
              exclusive
              fullWidth
              value={startKind}
              onChange={(_event, value) => setStartKind(value)}
            >
              <ToggleButton value="SINGLE IN">SINGLE IN</ToggleButton>
              <ToggleButton value="DOUBLE IN">DOUBLE IN</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              color="info"
              exclusive
              fullWidth
              value={finishKind}
              onChange={(_event, value) => setFinishKind(value)}
            >
              <ToggleButton value="SINGLE OUT">SINGLE OUT</ToggleButton>
              <ToggleButton value="DOUBLE OUT">DOUBLE OUT</ToggleButton>
              <ToggleButton value="MASTERS OUT">MASTERS OUT</ToggleButton>
            </ToggleButtonGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setStartGame(true), setOpen(false);
            }}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullScreen open={startGame}>
        <DialogTitle>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: "7vh",
              fontSize: "5vh",
            }}
          >
            <IconButton onClick={() => setStartGame(false)}>
              <MenuIcon />
            </IconButton>
            <div style={{ flex: 1 }}>{`Game: ${startScore}`}</div>
            <div style={{ flex: 1 }}>{`Start: ${startKind}`}</div>
            <div style={{ flex: 1 }}>{`Finish: ${finishKind}`}</div>
          </div>
        </DialogTitle>
        <DialogContent>
          <DartOverview
            kind={startScore}
            start={startKind}
            finish={finishKind}
          />
        </DialogContent>
      </Dialog>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Schnelles Spiel
      </Button>
    </div>
  );
};

export default DartHome;
