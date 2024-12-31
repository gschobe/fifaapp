import { Button, Grid, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CricketNumbersMode, GameSettings } from "dart/Definitions";
import {
  defaultCricketNumbers,
  defaultDartBoardNumbers,
} from "dart/assets/numbers";
import React from "react";

const CricketSettingsPanel: React.FC<{
  gameSettings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}> = ({ gameSettings, setSettings }) => {
  const settings = gameSettings.cricket;
  // const [choosenNumbers, setCn] = React.useState<Map<number, boolean>>(
  //   new Map(defaultDartBoardNumbers.map((ddbn) => [ddbn, false]))
  // );
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
            cricket: { ...settings, mode: value },
          })
        }
      >
        <ToggleButton value={"DEFAULT"}>DEFAULT</ToggleButton>
        <ToggleButton value={"CUT THROAT"}>CUT THROAT</ToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup
        color="info"
        exclusive
        fullWidth
        value={settings.numbersMode}
        onChange={(_event, value) => {
          setSettings({
            ...gameSettings,
            cricket: {
              ...settings,
              numbersMode: value,
              numbers: getNumbers(value),
            },
          });
        }}
      >
        <ToggleButton key={"DEFAULT"} value={"DEFAULT"}>
          DEFAULT
        </ToggleButton>
        <ToggleButton key="RANDOM" value="RANDOM">
          RANDOM
        </ToggleButton>
        <ToggleButton key="PICKIT" value="PICKIT">
          PICK IT
        </ToggleButton>
      </ToggleButtonGroup>
      {settings.numbersMode === "PICKIT" && (
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
                  setSettings({
                    ...gameSettings,
                    cricket: {
                      ...settings,
                      numbers: settings.numbers.includes(ddbn)
                        ? settings.numbers.filter((n) => n !== ddbn)
                        : [...settings.numbers, ddbn],
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

export default CricketSettingsPanel;

function getNumbers(numberMode: CricketNumbersMode) {
  switch (numberMode) {
    case "DEFAULT":
      return defaultCricketNumbers;
    case "RANDOM": {
      const numbers = [...defaultDartBoardNumbers];
      while (numbers.length > 7) {
        numbers.splice(Math.floor(Math.random() * numbers.length), 1);
      }
      return numbers;
    }
    case "PICKIT":
      return [];
  }
}
