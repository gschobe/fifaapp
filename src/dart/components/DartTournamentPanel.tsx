import { Button, Grid, Stack } from "@mui/material";
import { DartTournament } from "dart/Definitions";
import { defaultGameSettings } from "dart/utils/DartUtil";
import React from "react";
import { DartGame, DartStoreProps, dartConnector } from "store/DartStore";
import GameDialog from "./gameSettings/GameDialog";

interface Props extends DartStoreProps {
  dartNight: number;
  id: number;
  dt: DartTournament | undefined;
  draw: (dt: DartTournament) => void;
}

const DartTournamentPanel: React.FC<Props> = ({
  dartNight,
  id,
  dt,
  draw,
  startGame,
}) => {
  const startDraw = React.useCallback(() => dt && draw(dt), [draw]);
  console.log(dt);
  const [gameOpen, setGameOpen] = React.useState(false);

  const [activeGame, setActiveGame] = React.useState<DartGame>();
  const startNextGame = () => {
    startGame({ dartNight: dartNight, tournamentId: dt?.id ?? 0 });
    // setActiveGame(dt?.games.find((g) => g.state === "UPCOMING"));
  };

  React.useEffect(() => {
    const active = dt?.games.find((g) => g.state === "RUNNING");
    if (active) {
      setActiveGame(active);
      setGameOpen(true);
    }
  }, [dt]);
  return (
    <>
      <GameDialog
        open={gameOpen}
        setOpen={setGameOpen}
        gameSettings={dt?.gameSettings ?? defaultGameSettings}
        game={activeGame}
      />
      <Grid
        container
        style={{ height: "100%", paddingTop: "2vh" }}
        rowSpacing={3}
      >
        <Grid item xs={12}>
          <Stack direction={"row"} spacing={5} fontSize={"2.5vh"}>
            <div>{`Tournament ${id}`}</div>
            <div>{`Mode: ${dt?.tournamentSettings.teamMode} / ${dt?.tournamentSettings.mode}`}</div>
            <div>{`Game: ${dt?.gameSettings.choosenGame}`}</div>
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          flex={1}
          justifyContent={"space-evenly"}
          display={"flex"}
        >
          {dt?.games.length === 0 ? (
            <Button
              variant="contained"
              color="secondary"
              style={{ height: "10vh", fontSize: "3vh", width: "50vw" }}
              onClick={() => startDraw()}
            >
              Auslosung starten
            </Button>
          ) : (
            <Stack width={"100%"}>
              {dt?.games?.map((g) => (
                <Stack direction={"row"} key={g.sequence} columnGap={10}>
                  <div>{(g.sequence ?? 0) + 1}</div>
                  <div>{g.state}</div>
                  {g.players.map((p) => p.team.name)}
                </Stack>
              ))}
              <Button
                disabled={dt?.games.some((g) => g.state === "RUNNING")}
                variant="contained"
                color="secondary"
                style={{ height: "10vh", fontSize: "3vh", width: "50vw" }}
                onClick={() => startNextGame()}
              >
                Nächste Spiel starten
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default dartConnector(DartTournamentPanel);
