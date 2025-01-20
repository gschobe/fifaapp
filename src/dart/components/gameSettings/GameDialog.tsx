import { Dialog, DialogContent } from "@material-ui/core";
import Close from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import ATCDartOverview from "dart/ATCDartOverview";
import CricketDartOverview from "dart/CricketDartOverview";
import { DartTeam, GameSettings } from "dart/Definitions";
import EliminationDartOverview from "dart/EliminationDartOverview";
import ShooterDartOverview from "dart/ShooterDartOverview";
import X01DartOverviewCopy from "dart/X01DartOverview copy";
import { getChoosenGameSettings } from "dart/utils/DartUtil";
import React from "react";
import { DartGame } from "store/DartStore";
import "../../DartApp.css";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  gameSettings: GameSettings;
  players?: DartTeam[];
  game?: DartGame;
}
const GameDialog: React.FC<Props> = ({
  open,
  setOpen,
  gameSettings,
  players,
  game,
}) => {
  return (
    <Dialog fullScreen open={open}>
      <DialogContent>
        <div
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              height: "6vh",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              alignItems: "center",
              lineHeight: "3.5vh",
              fontSize: "3vh",
              columnGap: 20,
              marginBottom: "5pt",
            }}
          >
            {/* <IconButton onClick={() => setOpen(false)}>
              <MenuIcon sx={{ padding: 0 }} fontSize="small" />
            </IconButton> */}
            <div>{`Game: ${game?.type}`}</div>
            {game && getChoosenGameSettings(game)}
            <div>{`First to: ${game?.settings.sets} Set(s) / ${game?.settings.legs} Leg(s)`}</div>
            <div style={{ flex: 1 }} />
            <Button onClick={() => setOpen(false)} variant="contained">
              <Close sx={{ padding: 0 }} fontSize="small" />
            </Button>
          </div>

          {game?.type === "X01" ? (
            <X01DartOverviewCopy
              gameSettings={gameSettings.x01}
              dartGame={game}
              players={players}
            />
          ) : game?.type === "Cricket" ? (
            <CricketDartOverview
              gameSettings={gameSettings.cricket}
              dartGame={game}
              players={players}
            />
          ) : game?.type === "ATC" ? (
            <ATCDartOverview
              gameSettings={gameSettings.atc}
              players={players}
              dartGame={game}
            />
          ) : game?.type === "Shooter" ? (
            <ShooterDartOverview
              gameSettings={gameSettings.shooter}
              players={players}
              dartGame={game}
            />
          ) : game?.type === "Elimination" ? (
            <EliminationDartOverview
              gameSettings={gameSettings.elimination}
              players={players}
              dartGame={game}
            />
          ) : (
            <></>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameDialog;
