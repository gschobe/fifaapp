import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from "@mui/material";
import {
  ALL_DART_GAME_MODES,
  ALL_X01_KINDS,
  DPlayer,
  GameSettings,
} from "dart/Definitions";
import React from "react";
import PlayerSelect from "views/Overview/CreateComponents/PlayerSelect";
import CricketSettingsPanel from "./CricketSettingsPanel";
import ATCSettingsPanel from "./ATCSettingsPanel";
import { Player } from "definitions/Definitions";
import ShooterSettingsPanel from "./ShooterSettingsPanel";
import { DartStoreProps, dartConnector } from "store/DartStore";

interface Props extends DartStoreProps {
  open: boolean;
  settings: GameSettings;
  setSettings: (settings: GameSettings) => void;
  start: () => void;
  cancel: () => void;
  playerValue: DPlayer[];
  setPlayerValue?: (players: DPlayer[]) => void;
  createTournament: boolean;
}

const GameSelectDialog: React.FC<Props> = ({
  open,
  settings,
  setSettings,
  start,
  cancel,
  playerValue,
  setPlayerValue,
  createTournament,
  dPlayers,
}) => {
  const [playerOpen, setPlayerOpen] = React.useState(false);
  const playerOptions = React.useMemo(() => {
    return Object.values(dPlayers);
  }, [dPlayers]);
  const playersChanged = (players: Player[]) => {
    setPlayerValue && setPlayerValue(players);
  };
  return (
    <Dialog fullWidth open={open}>
      <DialogTitle>{`Choose Game Settings ${
        createTournament ? `for Tournament` : ``
      }`}</DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 6,
          }}
        >
          {setPlayerValue && (
            <PlayerSelect
              disabled={createTournament}
              playerOpen={playerOpen}
              setPlayerOpen={setPlayerOpen}
              playerValue={playerValue}
              setPlayerValue={playersChanged}
              playerOptions={playerOptions}
            />
          )}
          <ToggleButtonGroup
            color="error"
            exclusive
            fullWidth
            value={settings.choosenGame}
            onChange={(_event, value) =>
              setSettings({ ...settings, choosenGame: value })
            }
          >
            {ALL_DART_GAME_MODES.map((mode) => (
              <ToggleButton key={mode} value={mode}>
                {mode}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <Divider />
          {settings.choosenGame === "X01" ? (
            <X01SettingsPanel
              gameSettings={settings}
              setSettings={setSettings}
            />
          ) : settings.choosenGame === "CRICKET" ? (
            <CricketSettingsPanel
              gameSettings={settings}
              setSettings={setSettings}
            />
          ) : settings.choosenGame === "ATC" ? (
            <ATCSettingsPanel
              gameSettings={settings}
              setSettings={setSettings}
            />
          ) : settings.choosenGame === "SHOOTER" ? (
            <ShooterSettingsPanel
              gameSettings={settings}
              setSettings={setSettings}
            />
          ) : (
            <EliminationSettingsPanel
              gameSettings={settings}
              setSettings={setSettings}
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            cancel();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={
            playerValue.length === 0 ||
            (settings.choosenGame === "CRICKET" &&
              settings.cricket.numbers.length !== 7)
          }
          variant="contained"
          color="primary"
          onClick={() => {
            start();
          }}
        >
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default dartConnector(GameSelectDialog);

const X01SettingsPanel: React.FC<{
  gameSettings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}> = ({ gameSettings, setSettings }) => {
  const settings = gameSettings.x01;
  return (
    <>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.kind}
        onChange={(_event, value) =>
          setSettings({ ...gameSettings, x01: { ...settings, kind: value } })
        }
      >
        {ALL_X01_KINDS.map((kind) => (
          <ToggleButton key={kind} value={kind}>
            {kind}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.startKind}
        onChange={(_event, value) =>
          setSettings({
            ...gameSettings,
            x01: { ...settings, startKind: value },
          })
        }
      >
        <ToggleButton value="SINGLE IN">SINGLE IN</ToggleButton>
        <ToggleButton value="DOUBLE IN">DOUBLE IN</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.finishKind}
        onChange={(_event, value) =>
          setSettings({
            ...gameSettings,
            x01: { ...settings, finishKind: value },
          })
        }
      >
        <ToggleButton value="SINGLE OUT">SINGLE OUT</ToggleButton>
        <ToggleButton value="DOUBLE OUT">DOUBLE OUT</ToggleButton>
        <ToggleButton value="MASTERS OUT">MASTERS OUT</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

const EliminationSettingsPanel: React.FC<{
  gameSettings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}> = ({ gameSettings, setSettings }) => {
  const settings = gameSettings.x01;
  return (
    <>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.kind}
        onChange={(_event, value) =>
          setSettings({
            ...gameSettings,
            elimination: { ...settings, kind: value },
          })
        }
      >
        {ALL_X01_KINDS.map((kind) => (
          <ToggleButton key={kind} value={kind}>
            {kind}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.finishKind}
        onChange={(_event, value) =>
          setSettings({
            ...gameSettings,
            elimination: { ...settings, finishKind: value },
          })
        }
      >
        <ToggleButton value="SINGLE OUT">SINGLE OUT</ToggleButton>
        <ToggleButton value="DOUBLE OUT">DOUBLE OUT</ToggleButton>
        <ToggleButton value="MASTERS OUT">MASTERS OUT</ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};
