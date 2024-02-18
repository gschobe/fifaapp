import { Button, Grid } from "@material-ui/core";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Stack } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DartGame, DartStoreProps, dartConnector } from "store/DartStore";
import {
  DartTournament,
  DartTournamentSettings,
  GameSettings,
} from "./Definitions";
import DartGameItem from "./components/DartGameItem";
import TournamentItem from "./components/TournamentItem";
import CreateTournamentDialog from "./components/gameSettings/CreateTournamentDialog";
import GameDialog from "./components/gameSettings/GameDialog";
import GameSelectDialog from "./components/gameSettings/GameSelectDialog";
import { getGameForDartNight } from "./utils/DartDrawUtil";
import { defaultGameSettings } from "./utils/DartUtil";
import { Settings } from "@material-ui/icons";
import DartNightSettingsDialog from "./components/gameSettings/DartNightSettingsDialog";
import DartNightSingleGameChart from "./components/DartNightSingleGameChart";

interface Props extends DartStoreProps {
  id: number;
}
const DartNightView: React.FC<Props> = ({
  id,
  dartNights,
  addTournament,
  removeTournament,
  addGame,
}) => {
  const navigate = useNavigate();
  const dartNight = dartNights[id];
  const [gameOpen, setGameOpen] = React.useState(false);
  const [activeGame, setActiveGame] = React.useState<DartGame>();
  const [createMode, setCreateMode] = React.useState<"GAME" | "TOURNAMENT">();
  const [tournamentOpen, setTournamentOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [dnSettingsOpen, setSettingsOpen] = React.useState(false);
  const [
    selectedTournmanet,
    setSelectedTournament,
  ] = React.useState<DartTournament>();
  const [
    tournamentSettings,
    setTournamentSettings,
  ] = React.useState<DartTournamentSettings>({
    mode: "LEAGUE",
    teamMode: "SINGLE",
  });

  const [settings, setSettings] = React.useState<GameSettings>(
    defaultGameSettings
  );
  React.useEffect(() => {
    setActiveGame(dartNight?.games.find((g) => g.state !== "FINISHED"));
  }, [dartNight?.games]);

  if (!dartNight) {
    return <h3>Not found!</h3>;
  }
  const tournaments = [...dartNight.tournaments].reverse();
  const singleGames = [...dartNight.games].reverse();

  const cancel = () => {
    setOpen(false);
    setTournamentOpen(false);
    setCreateMode(undefined);
  };

  const start = () => {
    setOpen(false);
    if (createMode === "GAME") {
      const game = getGameForDartNight(
        settings,
        dartNight.id,
        dartNight.players.map((p) => ({ name: p.name, players: [{ ...p }] })),
        dartNight.games.length + 1
      );
      addGame(game);
    } else if (createMode === "TOURNAMENT") {
      const now = new Date();
      addTournament({
        dartNight: id,
        tournament: {
          id: now.getTime(),
          state: "NEW",
          gameSettings: settings,
          teams: [],
          games: [],
          tournamentSettings: tournamentSettings,
          withSecondRound: false,
        },
      });
    }
  };

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
      <DartNightSettingsDialog
        open={dnSettingsOpen}
        dartNight={dartNight}
        cancel={() => setSettingsOpen(false)}
      />
      <CreateTournamentDialog
        open={tournamentOpen}
        setOpen={setTournamentOpen}
        tournamentSettings={tournamentSettings}
        setTournamentSettings={setTournamentSettings}
        playerValue={dartNight?.players ?? []}
        next={() => setOpen(true)}
        cancel={cancel}
      />
      <GameSelectDialog
        open={open}
        settings={settings}
        setSettings={setSettings}
        start={start}
        cancel={cancel}
        playerValue={dartNight?.players ?? []}
        createTournament={true}
      />
      <GameDialog
        open={!!activeGame && gameOpen}
        setOpen={setGameOpen}
        gameSettings={settings}
        players={dartNight.players.map((p) => {
          return { name: p.name, players: [p] };
        })}
        game={activeGame}
      />
      <div style={{ width: "100%" }}>
        <Stack
          direction={"row"}
          marginTop={"10px"}
          spacing={2}
          alignItems={"center"}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "4vh",
              display: "flex",
              lineHeight: "100%",
            }}
          >{`Dart Abend ${
            Object.values(dartNights).indexOf(dartNight) + 1
          } - ${new Date(dartNight?.startDate ?? new Date()).toLocaleDateString(
            "de-DE"
          )}`}</div>
          <div style={{ flex: 1 }} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCreateMode("GAME");
              setOpen(true);
            }}
          >
            {"Neues Einzelspiel"}
          </Button>
          <Button
            disabled={
              selectedTournmanet === undefined &&
              dartNight?.tournaments.some((t) => t.state !== "FINISHED")
            }
            variant="contained"
            onClick={() => {
              setCreateMode("TOURNAMENT");
              selectedTournmanet
                ? setSelectedTournament(undefined)
                : setTournamentOpen(true);
            }}
          >
            {selectedTournmanet ? "Zurück" : "Neues Turnier"}
          </Button>
          <IconButton
            onClick={() => setSettingsOpen(true)}
            sx={{ boxShadow: 3, padding: 5 }}
          >
            <Settings />
          </IconButton>
        </Stack>
        {dartNight.games.length > 0 && (
          <div style={{ marginTop: 15 }}>
            <div style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>
              Einzelspiele
            </div>
            <DartNightSingleGameChart dartNight={dartNight} />
            <Grid
              container
              spacing={1}
              style={{ overflow: "auto", marginTop: 5 }}
            >
              {singleGames?.map((g, idx) => (
                <Grid key={idx} item xs={12} style={{ marginRight: "10px" }}>
                  <DartGameItem game={g} open={() => setGameOpen(true)} />
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        <div>
          <h5>Turniere</h5>
          <Grid container spacing={1} style={{ overflow: "auto" }}>
            {tournaments?.map((dt) => (
              <Grid
                item
                key={dt?.id}
                xs={12}
                style={{ marginRight: "10px", marginBottom: "5px" }}
              >
                <TournamentItem
                  id={Object.values(dartNight.tournaments).indexOf(dt) + 1}
                  dt={dt}
                  setSelectedTournament={setSelectedTournament}
                  removeTournament={() =>
                    removeTournament({
                      dartNight: dartNight.id,
                      tournament: dt,
                    })
                  }
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default dartConnector(DartNightView);
