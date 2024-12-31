import { Button, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { GameSettings } from "dart/Definitions";
import { defaultDartBoardNumbers } from "dart/assets/numbers";
import React from "react";
import { NumberField } from "./GameSelectDialog";

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
        <NumberField
          value={settings.rounds}
          onChange={(rounds) =>
            setSettings({
              ...gameSettings,
              shooter: {
                ...settings,
                rounds: rounds,
              },
            })
          }
          disabled={settings.numberMode === "SELECTED"}
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
        <Grid container columns={{ xs: 7 }} columnSpacing={1} rowSpacing={0.5}>
          {defaultDartBoardNumbers.map((ddbn) => (
            <Grid key={ddbn} item xs={1}>
              <Button
                fullWidth
                color="info"
                variant={
                  settings.numbers.includes(ddbn) ? "contained" : "outlined"
                }
                onClick={() => {
                  const numbers = settings.numbers.includes(ddbn)
                    ? settings.numbers.filter((n) => n !== ddbn)
                    : [...settings.numbers, ddbn];
                  setSettings({
                    ...gameSettings,
                    shooter: {
                      ...settings,
                      numbers: numbers,
                      rounds: numbers.length,
                    },
                  });
                }}
                sx={{
                  flex: 1,
                  fontWeight: "bold",
                  fontSize: "3.5vh",
                  lineHeight: "3.5vh",
                  boxShadow: 1,
                }}
              >
                {ddbn}
              </Button>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default ShooterSettingsPanel;
