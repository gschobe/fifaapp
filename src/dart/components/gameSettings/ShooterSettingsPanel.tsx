import { TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { GameSettings } from "dart/Definitions";
import {
  defaultDartBoardNumbers,
  first7,
  last7,
  middle7,
} from "dart/assets/numbers";
import React from "react";

const ShooterSettingsPanel: React.FC<{
  gameSettings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}> = ({ gameSettings, setSettings }) => {
  const settings = gameSettings.shooter;
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <div style={{ width: "30%", textAlign: "center" }}># Runden:</div>
        <TextField
          type="number"
          InputProps={{ inputProps: { min: 1, max: 20 } }}
          onChange={(event) => {
            setSettings({
              ...gameSettings,
              shooter: {
                ...settings,
                rounds: Number(event.target.value),
              },
            });
          }}
          sx={{
            flex: 1,
            "& .MuiInputBase-input": {
              textAlign: "center",
              fontSize: 24,
              paddingY: 1,
            },
          }}
          value={settings.rounds}
        />
      </div>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.numberMode}
        onChange={(_event, value) => {
          setSettings({
            ...gameSettings,
            shooter: {
              ...settings,
              numberMode: value,
              // numbers: getNumbers(value),
            },
          });
        }}
      >
        <ToggleButton key={"RANDOM"} value={"RANDOM"}>
          RANDOM
        </ToggleButton>
        <ToggleButton key="SELECTED" value="SELECTED">
          SELECTED
        </ToggleButton>
      </ToggleButtonGroup>
      {settings.numberMode === "SELECTED" && (
        <>
          <ToggleButtonGroup
            fullWidth
            value={first7}
            onChange={(_event, value) =>
              setSettings({
                ...gameSettings,
                shooter: {
                  ...settings,
                  numbers: value.concat(middle7).concat(last7),
                },
              })
            }
          >
            {defaultDartBoardNumbers.slice(0, 7).map((n) => (
              <ToggleButton key={n} value={n}>
                {n}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            fullWidth
            value={middle7}
            onChange={(_event, value) =>
              setSettings({
                ...gameSettings,
                shooter: {
                  ...settings,
                  numbers: first7.concat(value).concat(last7),
                },
              })
            }
          >
            {defaultDartBoardNumbers.slice(7, 14).map((n) => (
              <ToggleButton key={n} value={n}>
                {n}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            fullWidth
            value={last7}
            onChange={(_event, value) =>
              setSettings({
                ...gameSettings,
                shooter: {
                  ...settings,
                  numbers: first7.concat(middle7).concat(value),
                },
              })
            }
          >
            {defaultDartBoardNumbers.slice(14).map((n) => (
              <ToggleButton key={n} value={n}>
                {n}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </>
      )}
    </>
  );
};

export default ShooterSettingsPanel;
