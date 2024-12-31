import { PersonAdd } from "@material-ui/icons";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import { playerTableColumnsForDart } from "definitions/TableDefinitions";
import _ from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DartStoreProps, dartConnector } from "store/DartStore";
import AddPlayerModal from "views/Overview/CreateComponents/AddPlayerModal";
import "./DartApp.css";
import { DPlayer, DartTeam, GameSettings } from "./Definitions";
import DartGameItem from "./components/DartGameItem";
import DartNightItem from "./components/DartNightItem";
import CreateDartNightDialog from "./components/gameSettings/CreateDartNightDialog";
import GameDialog from "./components/gameSettings/GameDialog";
import GameSelectDialog from "./components/gameSettings/GameSelectDialog";
import { getFastGame } from "./utils/DartDrawUtil";
import { defaultGameSettings } from "./utils/DartUtil";

const DartHome: React.FC<DartStoreProps> = ({
  dartNights,
  addDartNight,
  fastGameHistory,
  fastGame,
  setFastGame,
  dPlayers,
}) => {
  const [open, setOpen] = React.useState(false);
  const [tournamentOpen, setTournamentOpen] = React.useState(false);
  const [startGame, setStartGame] = React.useState(false);
  const [playerValue, setPlayerValue] = React.useState<DPlayer[]>([]);
  const [teams, setTeams] = React.useState<DartTeam[]>([]);
  const [location, setLocation] = React.useState<string>("");
  const [createTournament, setCreateTournament] = React.useState(false);
  const [addPlayerOpen, setAddPlayerOpen] = React.useState(false);
  const [fastGameToShow, setFGTS] = React.useState(fastGame);
  const [randomPlayers, setRandomPlayer] = React.useState(true);

  const players = React.useMemo(() => {
    return Object.values(dPlayers);
  }, [dPlayers]);

  const navigate = useNavigate();

  const [settings, setSettings] = React.useState<GameSettings>(
    defaultGameSettings
  );

  const start = () => {
    setOpen(false);
    const dartTeams =
      teams.length > 0
        ? teams
        : playerValue.map((p) => ({ name: p.name, players: [{ ...p }] }));
    const game = getFastGame(
      settings,
      randomPlayers ? _.shuffle(dartTeams) : dartTeams
    );
    setFastGame(game);
    setStartGame(true);
  };

  React.useEffect(() => setFGTS(fastGame), [fastGame]);
  const createDartNight = () => {
    const now = new Date();
    const players = playerValue.filter((p) => p != undefined);
    addDartNight({
      id: now.getTime(),
      players: players,
      startDate: now.toISOString(),
      state: "NEW",
      tournaments: [],
      games: [],
      settings: {
        money: players.map((_p, idx) => ({ rank: idx + 1, money: 0 })),
      },
      possibleDraws: [],
    });
  };

  const cancel = () => {
    setOpen(false);
    setTournamentOpen(false);
    setCreateTournament(false);
    setPlayerValue([]);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
        setTeams={setTeams}
        teams={teams}
        random={randomPlayers}
        setRandom={setRandomPlayer}
      />
      <GameDialog
        open={startGame}
        setOpen={setStartGame}
        gameSettings={settings}
        players={playerValue.map((p) => {
          return { name: p.name, players: [p] };
        })}
        game={fastGameToShow}
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
      <Grid container columnSpacing={3} display={"flex"}>
        <Grid item xs={12}>
          <Card>
            <CardHeader color="info">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>Schnelles Spiel</div>
                <Button
                  // sx={{ lineHeight: "5vh", fontSize: "3vh" }}
                  variant="contained"
                  color="primary"
                  onClick={() => setOpen(true)}
                  disabled={fastGame && fastGame.state !== "FINISHED"}
                >
                  Neues Schnelles Spiel
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {fastGame && (
                <DartGameItem
                  game={fastGame}
                  open={() => {
                    setFGTS(fastGame);
                    setStartGame(true);
                  }}
                />
              )}
              {[...fastGameHistory]
                .sort((g1, g2) => g2.id - g1.id)
                .map((fg) => (
                  <DartGameItem
                    key={fg.id}
                    game={fg}
                    open={() => {
                      setFGTS(fg);
                      setStartGame(true);
                    }}
                  />
                ))}
            </CardBody>
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="info">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div>Spieler</div>
                <div style={{ flexGrow: 1 }} />
                <IconButton
                  color="primary"
                  aria-label="add player"
                  style={{ padding: "0" }}
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
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader color="success">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>Dart Abende</div>
                <Button
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
      </Grid>
    </div>
  );
};

export default dartConnector(DartHome);

export const DeleteModal: React.FC<{
  open: boolean;
  close: () => void;
  remove: () => void;
}> = ({ open, close, remove }) => {
  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Dartabend löschen?</DialogTitle>
      <DialogContent>Willst du den Dartabend wirklich löschen?</DialogContent>
      <DialogActions>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            close();
          }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            remove();
          }}
        >
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};
