import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  ALL_DART_GAME_MODES,
  ALL_TEAM_MODES,
  ALL_X01_KINDS,
  DPlayer,
  DartTeam,
  GameSettings,
} from "dart/Definitions";
import { Player } from "definitions/Definitions";
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";
import PlayerSelect from "views/Overview/CreateComponents/PlayerSelect";
import ATCSettingsPanel from "./ATCSettingsPanel";
import CricketSettingsPanel from "./CricketSettingsPanel";
import ShooterSettingsPanel from "./ShooterSettingsPanel";

interface Props extends DartStoreProps {
  open: boolean;
  settings: GameSettings;
  setSettings: (settings: GameSettings) => void;
  start: () => void;
  cancel: () => void;
  playerValue: DPlayer[];
  setPlayerValue?: (players: DPlayer[]) => void;
  createTournament: boolean;
  setTeams?: (teams: DartTeam[]) => void;
  teams: DartTeam[];
  random?: boolean;
  setRandom?: (random: boolean) => void;
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
  setTeams,
  teams,
  random,
  setRandom,
}) => {
  const [legs, setLegs] = React.useState(1);
  const [sets, setSets] = React.useState(1);
  const [playerOpen, setPlayerOpen] = React.useState(false);

  const playerOptions = React.useMemo(() => {
    const players: DPlayer[] = [];
    Object.values(dPlayers).forEach((p) => {
      if (p) {
        players.push({ ...p });
      }
    });
    return players;
  }, [dPlayers]);
  const playersChanged = (players: Player[]) => {
    setPlayerValue && setPlayerValue(players);
  };
  const teamOptions = React.useMemo(() => {
    const numPlayers = playerOptions.length;
    const options: number[] = [];
    if (numPlayers < 3) {
      return options;
    }
    const max = Math.ceil(numPlayers / 2);
    for (let i = max; i > 1; i--) {
      options.push(i);
    }

    return options;
  }, [playerOptions]);

  return (
    <Dialog fullWidth open={open} maxWidth={"md"}>
      <DialogTitle>
        <Stack direction={"row"} alignItems={"center"} columnGap={2}>
          {`Choose Game Settings ${createTournament ? `for Tournament` : ``}`}
          <Select
            size="small"
            value={settings.teamMode}
            onChange={(e) => {
              setSettings({ ...settings, teamMode: e.target.value });
              setTeams && setTeams([]);
              setPlayerValue && setPlayerValue([]);
            }}
          >
            {ALL_TEAM_MODES.map((mode) => (
              <MenuItem
                key={mode}
                value={mode}
                // disabled={mode === "TEAM" && playerValue.length < 4}
              >
                {mode}
              </MenuItem>
            ))}
          </Select>
          {settings.teamMode === "TEAM" && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 5,
              }}
            >
              <div style={{ fontSize: 14, width: "80px" }}># Teams:</div>
              <Select
                value={settings.teamSize}
                size="small"
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    teamSize: Number(event.target.value),
                  })
                }
              >
                {teamOptions.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </div>
          )}
        </Stack>
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            rowGap: 6,
          }}
        >
          <Stack direction={"row"} alignItems={"center"}>
            {setPlayerValue && (
              <Stack direction={"column"} flex={1}>
                {settings.teamMode === "SINGLE" && (
                  <Stack direction={"row"} alignItems={"center"} columnGap={1}>
                    <PlayerSelect
                      disabled={createTournament}
                      playerOpen={playerOpen}
                      setPlayerOpen={setPlayerOpen}
                      playerValue={playerValue}
                      setPlayerValue={playersChanged}
                      playerOptions={playerOptions}
                    />
                  </Stack>
                )}
                {settings.teamMode === "TEAM" && settings.teamSize && (
                  <Stack direction={"row"} columnGap={2}>
                    {Array(settings.teamSize)
                      .fill(0)
                      .map((_v, idx) => (
                        <Stack
                          direction={"row"}
                          key={idx}
                          flex={1}
                          alignItems={"center"}
                        >
                          <div style={{ width: "80px" }}>{`Team ${
                            idx + 1
                          }`}</div>
                          <Select
                            variant="standard"
                            size="small"
                            fullWidth
                            multiple
                            renderValue={(selected: any) => selected.join(", ")}
                            value={teams[idx]?.players.map((p) => p.name) ?? []}
                            onChange={(event) => {
                              const toAdd = playerOptions.filter(
                                (p) =>
                                  p !== undefined &&
                                  event.target.value.includes(p.name)
                              );
                              if (toAdd) {
                                const teamsNew = [...teams];
                                const newTeam: DartTeam = {
                                  name: toAdd
                                    .map((p) => p?.name ?? "")
                                    .join("-"),
                                  players: toAdd.map((p) => ({
                                    name: p?.name,
                                  })),
                                };
                                console.log(newTeam);
                                teamsNew[idx] = newTeam;
                                setTeams && setTeams(teamsNew);
                              }
                            }}
                          >
                            {playerOptions
                              .filter(
                                (po) =>
                                  !teams
                                    .flatMap((t, ti) =>
                                      ti === idx
                                        ? []
                                        : t.players.map((p) => p.name)
                                    )
                                    .includes(po.name)
                              )
                              .map((p) => {
                                if (p) {
                                  return (
                                    <MenuItem key={p.name} value={p.name}>
                                      <Checkbox
                                        checked={teams[idx]?.players.some(
                                          (v) => v.name === p.name
                                        )}
                                        color="primary"
                                      />
                                      <ListItemText primary={p.name} />
                                    </MenuItem>
                                  );
                                }
                              })}
                          </Select>
                        </Stack>
                      ))}
                  </Stack>
                )}
              </Stack>
            )}
            {setRandom && (
              <Stack direction={"row"} alignItems={"center"}>
                <Checkbox
                  checked={random}
                  onChange={(e) => setRandom && setRandom(e.target.checked)}
                />
                <div>random</div>
              </Stack>
            )}
          </Stack>
          {settings.choosenGame === "X01" &&
            (teams?.length === 2 || playerValue.length === 2) && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <div style={{ width: "30%", textAlign: "center" }}>
                  First to
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    height: "8vh",
                  }}
                >
                  <NumberField
                    value={sets}
                    onChange={(value) => {
                      setSets(value);
                      setSettings(
                        setLegsSetsToChoosenGame(settings, legs, value)
                      );
                    }}
                  />
                  <div style={{ width: "30%", textAlign: "center" }}>
                    Set(s)
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <NumberField
                    value={legs}
                    onChange={(value) => {
                      setLegs(value);
                      setSettings(
                        setLegsSetsToChoosenGame(settings, value, sets)
                      );
                    }}
                  />
                  <div style={{ width: "30%", textAlign: "center" }}>
                    Leg(s)
                  </div>
                </div>
              </div>
            )}
          <ToggleButtonGroup
            color="error"
            exclusive
            fullWidth
            value={settings.choosenGame}
            onChange={(_event, value) => {
              const newSettings = { ...settings, choosenGame: value };
              setSettings(setLegsSetsToChoosenGame(newSettings, legs, sets));
            }}
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
            (playerValue.length === 0 && teams.length < 2) ||
            (settings.choosenGame === "CRICKET" &&
              settings.cricket.numbers.length !== 7)
          }
          variant="contained"
          color="primary"
          onClick={() => {
            setLegs(1);
            setSets(1);
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
  const settings = gameSettings.elimination;
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
function setLegsSetsToChoosenGame(
  settings: GameSettings,
  legs: number,
  sets: number
): GameSettings {
  switch (settings.choosenGame) {
    case "X01":
      return {
        ...settings,
        x01: {
          ...settings.x01,
          legs: legs,
          sets: sets,
        },
      };
    case "CRICKET":
      return {
        ...settings,
        cricket: {
          ...settings.cricket,
          legs: legs,
          sets: sets,
        },
      };
    case "ATC":
      return {
        ...settings,
        atc: {
          ...settings.atc,
          legs: legs,
          sets: sets,
        },
      };
    case "SHOOTER":
      return {
        ...settings,
        shooter: {
          ...settings.shooter,
          legs: legs,
          sets: sets,
        },
      };
    case "ELIMINATION":
      return {
        ...settings,
        elimination: {
          ...settings.elimination,
          legs: legs,
          sets: sets,
        },
      };
  }
}

export const NumberField: React.FC<{
  value: number;
  onChange: (newValue: number) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled = false }) => {
  return (
    <Stack
      marginX={1}
      width={"60px"}
      spacing={"5px"}
      direction={"row"}
      flex={1}
    >
      <div
        style={{
          height: "80%",
          flex: 1,
          textAlign: "center",
          lineHeight: "7vh",
          fontSize: "4vh",
          borderRadius: "5%",
          border: "1px solid lightgray",
        }}
      >
        {value}
      </div>
      <Button
        disabled={disabled || value <= 1}
        variant="outlined"
        sx={{ minWidth: "20px" }}
        onClick={() => {
          onChange(value - 1);
        }}
      >
        -
      </Button>
      <Button
        disabled={disabled}
        variant="outlined"
        sx={{ minWidth: "20px" }}
        onClick={() => {
          onChange(value + 1);
        }}
      >
        +
      </Button>
    </Stack>
  );
};
