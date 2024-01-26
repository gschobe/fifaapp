import { Button, Grid } from "@material-ui/core";
import { Stack } from "@mui/material";
import React from "react";
import { DartStoreProps, dartConnector } from "store/DartStore";
import CreateTournamentDialog from "./components/gameSettings/CreateTournamentDialog";
import {
  DartTournament,
  DartTournamentSettings,
  GameSettings,
} from "./Definitions";
import GameSelectDialog from "./components/gameSettings/GameSelectDialog";
import {
  defaultCricketNumbers,
  defaultDartBoardNumbers,
} from "./assets/numbers";
import TournamentItem from "./components/TournamentItem";
import DartTournamentPanel from "./components/DartTournamentPanel";
import { determineTeamMatesAndTeams } from "./utils/DartDrawUtil";

interface Props extends DartStoreProps {
  id: number;
}
const DartNightView: React.FC<Props> = ({
  id,
  dartNights,
  addTournament,
  setTournamentGames,
}) => {
  const dartNight = dartNights[id];
  const [tournamentOpen, setTournamentOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
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

  const [settings, setSettings] = React.useState<GameSettings>({
    choosenGame: "X01",
    x01: { kind: 301, startKind: "SINGLE IN", finishKind: "SINGLE OUT" },
    cricket: {
      numbers: defaultCricketNumbers,
      mode: "DEFAULT",
      numbersMode: "DEFAULT",
    },
    atc: {
      mode: "DEFAULT",
      hitMode: "SINGLE",
      numberMode: "SEQUENCIAL",
      numbers: defaultDartBoardNumbers.slice(0, 20),
    },
  });

  if (!dartNight) {
    return <h3>Not found!</h3>;
  }
  const tournaments = [...dartNight.tournaments].reverse();

  const cancel = () => {
    setOpen(false);
    setTournamentOpen(false);
  };

  const start = () => {
    setOpen(false);
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
  };

  const doDraw = (dt: DartTournament) => {
    console.log(dt);
    setTournamentGames({
      dartNight: id,
      tournamentId: dt.id,
      games: determineTeamMatesAndTeams(dartNight, dt),
    });
  };

  return (
    <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
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
      <div style={{ width: "100%" }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          marginTop={"10px"}
        >
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
          <Button
            disabled={
              selectedTournmanet === undefined &&
              dartNight?.tournaments.some((t) => t.state !== "FINISHED")
            }
            variant="contained"
            onClick={() =>
              selectedTournmanet
                ? setSelectedTournament(undefined)
                : setTournamentOpen(true)
            }
          >
            {selectedTournmanet ? "Zurück" : "Neues Turnier"}
          </Button>
        </Stack>
        {!selectedTournmanet && (
          <div>
            <h5>Turniere</h5>
            <Grid container spacing={1} style={{ overflow: "auto" }}>
              {tournaments?.map((dt) => (
                <Grid item key={dt?.id} xs={12} style={{ marginRight: "10px" }}>
                  <TournamentItem
                    id={Object.values(dartNight.tournaments).indexOf(dt) + 1}
                    dt={dt}
                    setSelectedTournament={setSelectedTournament}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        {selectedTournmanet && (
          <DartTournamentPanel
            dartNight={id}
            id={
              Object.values(dartNight.tournaments).indexOf(selectedTournmanet) +
              1
            }
            dt={selectedTournmanet}
            draw={doDraw}
          />
        )}
      </div>
    </div>
  );
};

export default dartConnector(DartNightView);
