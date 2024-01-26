import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { GameSettings } from "dart/Definitions";
import {
  clockwiseDartBoardNumbers,
  counterclockwiseDartBoardNumbers,
  defaultDartBoardNumbers,
} from "dart/assets/numbers";
import React from "react";

const ATCSettingsPanel: React.FC<{
  gameSettings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}> = ({ gameSettings, setSettings }) => {
  const settings = gameSettings.atc;
  return (
    <>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.mode}
        onChange={(_event, value) =>
          setSettings({
            ...gameSettings,
            atc: { ...settings, mode: value },
          })
        }
      >
        <ToggleButton value={"DEFAULT"}>DEFAULT</ToggleButton>
        <ToggleButton value={"QUICK"}>QUICK</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.hitMode}
        onChange={(_event, value) => {
          setSettings({
            ...gameSettings,
            atc: {
              ...settings,
              hitMode: value,
            },
          });
        }}
      >
        <ToggleButton key={"SINGLE"} value={"SINGLE"}>
          SINGLE
        </ToggleButton>
        <ToggleButton key="DOUBLE" value="DOUBLE">
          DOUBLE
        </ToggleButton>
        <ToggleButton key="TRIPLE" value="TRIPLE">
          TRIPLE
        </ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.numberMode}
        onChange={(_event, value) => {
          setSettings({
            ...gameSettings,
            atc: {
              ...settings,
              numberMode: value,
              numbers:
                value === "SEQUENCIAL"
                  ? [...defaultDartBoardNumbers]
                  : value === "CLOCKWISE"
                  ? [...clockwiseDartBoardNumbers]
                  : [...counterclockwiseDartBoardNumbers],
            },
          });
        }}
      >
        <ToggleButton key={"SEQUENCIAL"} value={"SEQUENCIAL"}>
          SEQUENCIAL
        </ToggleButton>
        <ToggleButton key="CLOCKWISE" value="CLOCKWISE">
          CLOCKWISE
        </ToggleButton>
        <ToggleButton key="COUNTERCLOCKWISE" value="COUNTERCLOCKWISE">
          COUNTERCLOCKWISE
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
};

export default ATCSettingsPanel;
