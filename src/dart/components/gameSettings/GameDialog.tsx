import { Dialog, DialogContent, IconButton } from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import ATCDartOverview from "dart/ATCDartOverview";
import CricketDartOverview from "dart/CricketDartOverview";
import { DartTeam, GameSettings } from "dart/Definitions";
import X01DartOverview from "dart/X01DartOverview";
import React from "react";
import { DartGame } from "store/DartStore";
import "../../DartApp.css";
import ShooterDartOverview from "dart/ShooterDartOverview";
import EliminationDartOverview from "dart/EliminationDartOverview";

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
          style={{
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
          <IconButton onClick={() => setOpen(false)}>
            <MenuIcon sx={{ padding: 0 }} fontSize="small" />
          </IconButton>
          <div>{`Game: ${gameSettings.choosenGame}`}</div>
          {gameSettings.choosenGame === "X01" && (
            <>
              <div>{`Kind: ${gameSettings.x01.kind}`}</div>
              <div>{`Start: ${gameSettings.x01.startKind}`}</div>
              <div>{`Finish: ${gameSettings.x01.finishKind}`}</div>
            </>
          )}
          {gameSettings.choosenGame === "CRICKET" && (
            <>
              <div>{`Mode: ${gameSettings.cricket.mode}`}</div>
              <div>{`Numbers: ${gameSettings.cricket.numbersMode}`}</div>
            </>
          )}
          {gameSettings.choosenGame === "ATC" && (
            <>
              <div>{`Mode: ${gameSettings.atc.mode}`}</div>
              <div>{`Numbers: ${gameSettings.atc.numberMode}`}</div>
              <div>{`Hit: ${gameSettings.atc.hitMode}`}</div>
            </>
          )}
          {gameSettings.choosenGame === "SHOOTER" && (
            <>
              <div>{`Mode: ${gameSettings.shooter.numberMode}`}</div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {`Rounds:`}
                <div style={{ fontWeight: "bold", margin: "0 10px" }}>
                  {game?.round}
                </div>
                {` / ${gameSettings.shooter.rounds}`}
              </div>
            </>
          )}
          {gameSettings.choosenGame === "ELIMINATION" && (
            <>
              <div>{`Kind: ${gameSettings.elimination.kind}`}</div>
              <div>{`Finish: ${gameSettings.elimination.finishKind}`}</div>
            </>
          )}
        </div>

        {game?.type === "X01" ? (
          <X01DartOverview
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
      </DialogContent>
    </Dialog>
  );
};

export default GameDialog;
