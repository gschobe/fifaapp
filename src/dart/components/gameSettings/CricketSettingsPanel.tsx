import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { CricketNumbersMode, GameSettings } from "dart/Definitions";
import {
  defaultCricketNumbers,
  defaultDartBoardNumbers,
  first7 as first,
  last7 as last,
  middle7 as middle,
} from "dart/assets/numbers";
import React from "react";

const CricketSettingsPanel: React.FC<{
  gameSettings: GameSettings;
  setSettings: (settings: GameSettings) => void;
}> = ({ gameSettings, setSettings }) => {
  const settings = gameSettings.cricket;
  const first7 = [...first];
  const middle7 = [...middle];
  const last7 = [...last];
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
        <>
          <ToggleButtonGroup
            fullWidth
            value={first7}
            onChange={(_event, value) =>
              setSettings({
                ...gameSettings,
                cricket: {
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
                cricket: {
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
                cricket: {
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
