import { PersonAdd } from "@material-ui/icons";
import { Button, Grid, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { Player } from "definitions/Definitions";
import { playerTableColumnsForDart } from "definitions/TableDefinitions";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DartStoreProps, dartConnector } from "store/DartStore";
import AddPlayerModal from "views/Overview/CreateComponents/AddPlayerModal";
import "./DartApp.css";
import { GameSettings } from "./Definitions";
import DartNightItem from "./components/DartNightItem";
import CreateDartNightDialog from "./components/gameSettings/CreateDartNightDialog";
import GameDialog from "./components/gameSettings/GameDialog";
import GameSelectDialog from "./components/gameSettings/GameSelectDialog";
import { getFastGame } from "./utils/DartDrawUtil";
import { defaultGameSettings } from "./utils/DartUtil";

const DartHome: React.FC<DartStoreProps> = ({
  dartNights,
  addDartNight,
  fastGame,
  setFastGame,
  dPlayers,
}) => {
  const [open, setOpen] = React.useState(false);
  const [tournamentOpen, setTournamentOpen] = React.useState(false);
  const [startGame, setStartGame] = React.useState(false);
  const [playerValue, setPlayerValue] = React.useState<Player[]>([]);
  const [location, setLocation] = React.useState<string>("");
  const [createTournament, setCreateTournament] = React.useState(false);
  const [addPlayerOpen, setAddPlayerOpen] = React.useState(false);

  const players = React.useMemo(() => {
    return Object.values(dPlayers);
  }, [dPlayers]);

  const navigate = useNavigate();

  const [settings, setSettings] = React.useState<GameSettings>(
    defaultGameSettings
  );

  const start = () => {
    setOpen(false);
    setFastGame(
      getFastGame(
        settings,
        playerValue.map((p) => ({ name: p.name, players: [{ ...p }] }))
      )
    );
    setStartGame(true);
  };

  const createDartNight = () => {
    const now = new Date();
    addDartNight({
      id: now.getTime(),
      players: playerValue.filter((p) => p != undefined),
      startDate: now.toISOString(),
      state: "NEW",
      tournaments: [],
      games: [],
    });
  };

  const cancel = () => {
    setOpen(false);
    setTournamentOpen(false);
    setCreateTournament(false);
    setPlayerValue([]);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <AddPlayerModal
        open={addPlayerOpen}
        close={() => setAddPlayerOpen(false)}
        game="DART"
      />
      <GameSelectDialog
        open={open}
        settings={settings}
        setSettings={setSettings}
        start={start}
        cancel={cancel}
        playerValue={playerValue}
        setPlayerValue={setPlayerValue}
        createTournament={createTournament}
      />
      <GameDialog
        open={startGame}
        setOpen={setStartGame}
        gameSettings={settings}
        players={playerValue.map((p) => {
          return { name: p.name, players: [p] };
        })}
        game={fastGame}
      />
      <CreateDartNightDialog
        open={tournamentOpen}
        setOpen={setTournamentOpen}
        location={location}
        setLocation={setLocation}
        playerValue={playerValue}
        setPlayerValue={setPlayerValue}
        next={createDartNight}
        cancel={cancel}
      />
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          columnGap: 20,
          margin: "10pt 0pt",
        }}
      >
        {fastGame && (
          <div style={{ flex: 1 }}>
            <Button
              sx={{ lineHeight: "5vh", fontSize: "3vh" }}
              fullWidth
              variant="contained"
              color="success"
              onClick={() => setStartGame(true)}
            >
              Schnelles Spiel fortsetzen
            </Button>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <Button
            sx={{ lineHeight: "5vh", fontSize: "3vh" }}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Schnelles Spiel
          </Button>
        </div>
        <div style={{ flex: 1 }}>
          <Button
            sx={{ lineHeight: "5vh", fontSize: "3vh" }}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() => {
              setTournamentOpen(true);
              setCreateTournament(true);
            }}
          >
            Neuer Dartabend
          </Button>
        </div>
      </div>
      <Grid container width={"100%"} spacing={3}>
        <Grid item xs={8}>
          <Card>
            <CardHeader color="default">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div>Dart Nights</div>
              </div>
            </CardHeader>
            <CardBody>
              <Grid container spacing={1}>
                {Object.values(dartNights)
                  .reverse()
                  .map((dn) => (
                    <Grid item key={dn?.id} xs={12}>
                      <DartNightItem
                        dn={dn}
                        dartNight={Object.values(dartNights)}
                        open={() => navigate(`/dart/dartNight/${dn?.id}`)}
                      />
                    </Grid>
                  ))}
              </Grid>
            </CardBody>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader color="default">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div>Players</div>
                <div style={{ flexGrow: 1 }} />
                <IconButton
                  color="primary"
                  aria-label="add player"
                  style={{ padding: "0" }}
                  // className={classes.cardTitleWhite}
                  onClick={() => setAddPlayerOpen(true)}
                >
                  <PersonAdd />
                </IconButton>
              </div>
            </CardHeader>
            <CardBody>
              {players && players.length > 0 && (
                <DataGrid
                  disableSelectionOnClick
                  headerHeight={35}
                  rowHeight={30}
                  autoPageSize
                  getRowId={(row) => row.name}
                  rows={players}
                  columns={playerTableColumnsForDart(true)}
                />
              )}
            </CardBody>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default dartConnector(DartHome);
