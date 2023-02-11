import React from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import Card from "components/Card/Card.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { Box, Button, Checkbox, IconButton } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { gamesColumns, playerTableColumns } from "definitions/TableDefinitions";
import { Game, TournamentTeam } from "definitions/Definitions";
import determineTeamMatesAndTeams, { chooseTeams } from "utils/DrawUtils";
import { CardActions, Stack } from "@mui/material";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import CreateMatchDayAction from "views/Overview/actions/CreateMatchDayAction";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { getPlayersSortedByPoints } from "utils/TableUtils";
import { GameScore, tournamenTeamComp } from "./GameScore";
import { useNavigate } from "react-router-dom";
import AnimatedDraw from "./AnimatedDraw";
import DataSwitch from "./DataSwitch";

interface MatchDayProps {
  id: string;
}

const MatchdayView: React.FC<MatchDayProps & MatchDayStoreProps> = ({
  id,
  matchDays,
  setTournamentTeams,
  startGame,
  finishGame,
  setScore,
  finishMatchday,
  setPossibleDraws,
}) => {
  const navigate = useNavigate();
  const matchday = matchDays[id];

  const { previousMd, nextMd } = React.useMemo(() => {
    const matchdayKeys = Object.keys(matchDays).filter(
      (key) => !isNaN(parseInt(key))
    );
    const currentMdIndex = matchdayKeys.indexOf(id);
    const previousMd =
      currentMdIndex === 0 ? undefined : matchdayKeys[currentMdIndex - 1];
    const nextMd =
      id === matchdayKeys[matchdayKeys.length - 1]
        ? undefined
        : matchdayKeys[currentMdIndex + 1];
    return {
      previousMd: previousMd,
      nextMd: nextMd,
    };
  }, [id, matchDays]);

  // games table content hooks
  const [gamesAll, setGamesAll] = React.useState(false);
  const handleGamesAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGamesAll(event.target.checked);
  };

  // player table content hooks
  const [tableAll, setTableAll] = React.useState(true);
  const handleTableAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableAll(event.target.checked);
  };

  // animated draw hook
  const [drawState, setDrawState] = React.useState<
    "open" | "running" | "finished"
  >("open");
  const [drawPlayersFirst, setDrawPlayersFirst] = React.useState(true);
  const handleDrawFirstChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDrawPlayersFirst(event.target.checked);
  };

  // show live table hooks
  const [liveTable, setLiveTable] = React.useState(true);
  const handleLiveTableChange: (event: any) => void = (event) => {
    setLiveTable(event.target.checked);
  };

  if (!matchday) {
    return <h1>{`Matchday with ID ${id} not found!`}</h1>;
  }
  const activeTournament = matchday.tournaments.find(
    (t) => t.state !== "FINISHED"
  );
  const upcomingGame = activeTournament?.games.find(
    (game) => game.state === "UPCOMING"
  );

  const liveGame = activeTournament?.games.find(
    (game) => game.state === "RUNNING"
  );

  const mdPlayers = getPlayersSortedByPoints(
    tableAll || !activeTournament ? matchday.players : activeTournament.players,
    liveGame !== undefined,
    liveTable ? liveGame : undefined
  );

  const createTournament = () => {
    // create Teams
    const tournamentTeams: TournamentTeam[] = [];
    if (activeTournament !== undefined) {
      const { games, possibleDraws, clearUsed } = determineTeamMatesAndTeams(
        matchday,
        tournamentTeams,
        activeTournament
      );

      setTournamentTeams({
        matchdayId: id,
        tournamentId: activeTournament?.id,
        tTeams: tournamentTeams,
        games: games,
        clearUsed: clearUsed,
      });

      setPossibleDraws({
        matchdayId: id,
        draw: possibleDraws,
      });

      setDrawState(matchday.mode === "2on2-odd" ? "finished" : "running");
    }
  };

  const handleStartUpcoming = () => {
    if (activeTournament) {
      startGame({
        matchdayId: id,
        tournamentId: activeTournament.id,
        gameSeq: upcomingGame?.sequence,
      });
    }
  };

  const handleConfirmResult = () => {
    if (activeTournament) {
      finishGame({
        matchdayId: id,
        tournamentId: activeTournament.id,
        gameSeq: liveGame?.sequence,
      });
    }
  };

  const handleHomeScoreChange = (event: any) => {
    if (activeTournament) {
      setScore({
        matchdayId: id,
        tournamentId: activeTournament.id,
        gameSeq: liveGame?.sequence,
        homeScore: Number(event.target.value),
      });
    }
  };

  const handleAwayScoreChange = (event: any) => {
    if (activeTournament) {
      setScore({
        matchdayId: id,
        tournamentId: activeTournament.id,
        gameSeq: liveGame?.sequence,
        awayScore: Number(event.target.value),
      });
    }
  };

  const reDrawTeam = (teamIndex: number) => {
    if (activeTournament) {
      const tTeams = [...activeTournament?.tournamentTeams];
      if (tTeams && tTeams.length > 0) {
        const redrawTeam: TournamentTeam[] = [{ ...tTeams[teamIndex] }];
        if (redrawTeam) {
          const oldTeam = redrawTeam[0].team;
          const clear = chooseTeams(matchday, activeTournament, redrawTeam);
          const newTeam = redrawTeam[0].team;
          if (newTeam && oldTeam) {
            tTeams[teamIndex] = redrawTeam[0];
            const newTTeam = { ...redrawTeam[0], team: newTeam };
            const newGames: Game[] = [];
            activeTournament.games.forEach((g) => {
              if (g.homePlayer.team?.name === oldTeam?.name) {
                newGames.push({ ...g, homePlayer: newTTeam });
              } else if (g.awayPlayer.team?.name === oldTeam?.name) {
                newGames.push({ ...g, awayPlayer: newTTeam });
              } else {
                newGames.push({ ...g });
              }
            });
            setTournamentTeams({
              matchdayId: id,
              tournamentId: activeTournament?.id,
              tTeams: tTeams,
              games: newGames,
              clearUsed: clear,
            });
          }
        }
      }
    }
  };

  const mdFinished = matchday.state === "FINISHED";
  return (
    <>
      {matchday.mode !== "2on2-odd" &&
        drawState === "running" &&
        activeTournament &&
        activeTournament.tournamentTeams.length > 0 && (
          <AnimatedDraw
            drawRunning={drawState}
            setDrawRunning={setDrawState}
            teams={activeTournament?.tournamentTeams || []}
            drawPlayersFirst={drawPlayersFirst}
          />
        )}
      <Box display={"flex"} flexDirection="row">
        <IconButton
          onClick={() => navigate(`/matchday/${previousMd}`)}
          disabled={previousMd === undefined}
          style={{ padding: 0, marginLeft: "-30px" }}
        >
          <NavigateBeforeIcon fontSize="large" />
        </IconButton>
        <div
          style={{ fontWeight: "bold", fontSize: 24, margin: "5pt" }}
        >{`Welcome to Matchday ${id} ${
          activeTournament ? `/ Tournament ${activeTournament.id} ` : ``
        }`}</div>
        <Box flexGrow={1} />
        {!activeTournament &&
          matchday.state !== "FINISHED" &&
          !liveGame &&
          !upcomingGame && (
            <>
              <CreateMatchDayAction
                buttonType="TEXT"
                createNewMatchday={false}
                activeMatchday={matchday}
              />
              <Button
                onClick={() => {
                  finishMatchday(matchday.id);
                  navigate("/overview");
                }}
                variant="outlined"
                color="secondary"
              >
                FINISH Matchday
              </Button>
            </>
          )}
        <IconButton
          onClick={() => navigate(`/matchday/${nextMd}`)}
          style={{ padding: 0, marginRight: "-30px" }}
          disabled={nextMd === undefined}
        >
          <NavigateNextIcon fontSize="large" style={{ padding: 0 }} />
        </IconButton>
      </Box>
      {!(matchday.state === "FINISHED") && (
        <GridContainer>
          <GridItem {...{ xs: 12, sm: 6, md: 4 }}>
            <Card className="card-content">
              <CardHeader color="info">
                <div style={{ fontSize: "1.5em" }}>Draw</div>
              </CardHeader>
              <CardBody
                className={
                  activeTournament?.tournamentTeams.length === 0
                    ? "cardCenter"
                    : ""
                }
              >
                <Box
                  style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {activeTournament?.tournamentTeams.length === 0 && (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="large"
                        onClick={createTournament}
                      >
                        Start Draw
                      </Button>
                      <Box margin="3pt 0" />
                      <DataSwitch
                        checked={drawPlayersFirst}
                        onChange={handleDrawFirstChange}
                        checkedText={"Players first"}
                        uncheckedText={"Teams first"}
                        color="secondary"
                      />
                    </>
                  )}
                  {drawState !== "running" && (
                    <>
                      {activeTournament?.tournamentTeams.map((tt, index) => {
                        return tournamenTeamComp(
                          index,
                          tt,
                          "row",
                          activeTournament.state === "NEW",
                          reDrawTeam
                        );
                      })}
                    </>
                  )}
                </Box>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem {...{ xs: 12, sm: 6, md: 4 }}>
            <Card className="card-content">
              <CardHeader color="primary">
                <div style={{ fontSize: "1.5em" }}>Live</div>
              </CardHeader>
              <CardBody className={"cardCenter"}>
                {liveGame ? (
                  <GameScore
                    liveGame={liveGame}
                    homeScore={liveGame.goalsHome || 0}
                    awayScore={liveGame.goalsAway || 0}
                    handleHomeScoreChange={handleHomeScoreChange}
                    handleAwayScoreChange={handleAwayScoreChange}
                  />
                ) : (
                  ""
                )}
              </CardBody>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  disabled={liveGame === undefined}
                  onClick={handleConfirmResult}
                >
                  Confirm Result
                </Button>
              </CardActions>
            </Card>
          </GridItem>
          <GridItem {...{ xs: 12, sm: 6, md: 4 }}>
            <Card className="card-content">
              <CardHeader color="info">
                <div style={{ fontSize: "1.5em" }}>Upcoming</div>
              </CardHeader>
              <CardBody className={"cardCenter"}>
                {drawState !== "running" && upcomingGame ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: "10pt",
                      width: "100%",
                    }}
                  >
                    {tournamenTeamComp(1, upcomingGame?.homePlayer, "column")}
                    <div
                      style={{
                        fontWeight: "bolder",
                        fontSize: 20,
                        margin: "0 10pt",
                      }}
                    >
                      {"vs"}
                    </div>
                    {tournamenTeamComp(2, upcomingGame?.awayPlayer, "column")}
                  </div>
                ) : (
                  ""
                )}
              </CardBody>
              <CardActions>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  disabled={
                    upcomingGame === undefined || liveGame !== undefined
                  }
                  startIcon={<PlayArrowRoundedIcon />}
                  onClick={handleStartUpcoming}
                >
                  Start Game
                </Button>
              </CardActions>
            </Card>
          </GridItem>
        </GridContainer>
      )}
      <GridContainer>
        <GridItem {...{ xs: 12, sm: 12, md: 7 }}>
          <Card>
            <CardHeader color="success">
              <Stack direction="row">
                <div style={{ fontSize: "1.5em" }}>Games</div>
                <Box flex={1} />
                <DataSwitch
                  checked={activeTournament ? gamesAll : true}
                  onChange={handleGamesAllChange}
                  disabled={!activeTournament}
                />
                <Box flex={1} />
              </Stack>
            </CardHeader>
            <CardBody>
              {drawState !== "running" && (
                <DataGrid
                  headerHeight={30}
                  rowHeight={30}
                  autoPageSize
                  getRowId={(row) => `${row.tournamentId}${row.sequence}`}
                  selectionModel={
                    liveGame
                      ? [`${liveGame.tournamentId}${liveGame.sequence}`]
                      : []
                  }
                  rows={
                    mdFinished || gamesAll || !activeTournament
                      ? matchday.tournaments.flatMap((t) => t.games)
                      : activeTournament?.games || []
                  }
                  columns={gamesColumns(
                    !mdFinished,
                    activeTournament ? gamesAll : true
                  )}
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "id", sort: "asc" }],
                    },
                  }}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem {...{ xs: 12, sm: 12, md: 5 }}>
          <Card>
            <CardHeader color="success">
              <Box display="flex" flexDirection="row">
                <div style={{ fontSize: "1.5em" }}>Table</div>
                <Box flex={1} />
                <DataSwitch
                  checked={tableAll}
                  onChange={handleTableAllChange}
                  disabled={!activeTournament}
                />
                <Box flex={1} />
                <Box fontWeight="bold" paddingRight="5pt">
                  LIVE TABLE
                </Box>
                <Checkbox
                  checked={liveTable}
                  onChange={handleLiveTableChange}
                  size="small"
                  // color="primary"
                  style={{ padding: "0", color: "white" }}
                />
              </Box>
            </CardHeader>
            <CardBody>
              <DataGrid
                headerHeight={30}
                rowHeight={30}
                pageSize={mdPlayers.length}
                autoHeight
                hideFooter
                getRowId={(row) => row.name}
                rows={mdPlayers}
                columns={playerTableColumns(false)}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      {matchday.tournaments
        .filter((t) => t.state === "FINISHED")
        .map((t) => {
          return (
            <div key={`tournament-${t.id}`}>
              <hr />
              <div>{`Tournament ${t.id} - ${t.state}`}</div>
              <GridContainer>
                <GridItem {...{ xs: 12, sm: 12, md: 7 }}>
                  <Card>
                    <CardHeader color="success">
                      <div style={{ fontSize: "1.5em" }}>Games</div>
                    </CardHeader>
                    <CardBody>
                      <DataGrid
                        headerHeight={30}
                        rowHeight={30}
                        pageSize={t.games.length}
                        getRowId={(row) => row.sequence}
                        rows={t.games}
                        autoHeight
                        hideFooter
                        columns={gamesColumns(!mdFinished)}
                      />
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem {...{ xs: 12, sm: 12, md: 5 }}>
                  <Card>
                    <CardHeader color="success">
                      <div style={{ fontSize: "1.5em" }}>Table</div>
                    </CardHeader>
                    <CardBody>
                      <DataGrid
                        headerHeight={30}
                        rowHeight={30}
                        pageSize={t.players.length}
                        autoHeight
                        hideFooter
                        getRowId={(row) => row.name}
                        rows={getPlayersSortedByPoints(t.players)}
                        columns={playerTableColumns(false, false)}
                      />
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </div>
          );
        })}
    </>
  );
};

export default matchDayConnector(MatchdayView);
