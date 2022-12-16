import React from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import Card from "components/Card/Card.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { Box, Button } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { gamesColumns, playerTableColumns } from "definitions/TableDefinitions";
import { TournamentTeam } from "definitions/Definitions";
import determineTeamMatesAndTeams from "utils/DrawUtils";
import { CardActions } from "@mui/material";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import CreateMatchDayAction from "views/Overview/CreateMatchDayAction";
import { getPlayersSortedByPoints } from "utils/TableUtils";
import { GameScore, tournamenTeamComp } from "./GameScore";
import { useNavigate } from "react-router-dom";

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
  if (!matchday) {
    return <h1>{`Matchday with ID ${id} not found!`}</h1>;
  }
  console.log("live");
  const activeTournament = matchday.tournaments.find(
    (t) => t.state !== "FINISHED"
  );

  const mdPlayers = getPlayersSortedByPoints(matchday.players);

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
    }
  };

  const upcomingGame = activeTournament?.games.find(
    (game) => game.state === "UPCOMING"
  );

  const liveGame = activeTournament?.games.find(
    (game) => game.state === "RUNNING"
  );

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
  return (
    <>
      <Box display={"flex"} flexDirection="row">
        <div
          style={{ fontWeight: "bold", fontSize: 24, margin: "5pt" }}
        >{`Welcome to Matchday ${id} ${
          activeTournament ? `/ tournament ${activeTournament.id}` : ``
        }`}</div>
        <Box flexGrow={1} />
        {matchday.state !== "FINISHED" && !liveGame && !upcomingGame && (
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
      </Box>
      <GridContainer>
        <GridItem {...{ xs: 4 }}>
          <Card className="card-content">
            <CardHeader color="info">
              <div style={{ fontSize: "1.5em" }}>Draw</div>
            </CardHeader>
            <CardBody>
              <Box
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {activeTournament?.tournamentTeams.length === 0 ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={createTournament}
                  >
                    Start Draw
                  </Button>
                ) : (
                  <>
                    {activeTournament?.tournamentTeams.map((tt, index) => {
                      return tournamenTeamComp(index, tt);
                    })}
                  </>
                )}
              </Box>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem {...{ xs: 4 }}>
          <Card className="card-content">
            <CardHeader color="primary">
              <div style={{ fontSize: "1.5em" }}>Live</div>
            </CardHeader>
            <CardBody>
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
        <GridItem {...{ xs: 4 }}>
          <Card className="card-content">
            <CardHeader color="info">
              <div style={{ fontSize: "1.5em" }}>Upcoming</div>
            </CardHeader>
            <CardBody>
              {upcomingGame ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "10pt",
                  }}
                >
                  <div>{tournamenTeamComp(1, upcomingGame?.homePlayer)}</div>
                  <div style={{ fontWeight: "bolder", fontSize: 20 }}>
                    {"vs"}
                  </div>
                  <div>{tournamenTeamComp(2, upcomingGame?.awayPlayer)}</div>
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
                disabled={upcomingGame === undefined || liveGame !== undefined}
                startIcon={<PlayArrowRoundedIcon />}
                onClick={handleStartUpcoming}
              >
                Start Game
              </Button>
            </CardActions>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem {...{ xs: 6 }}>
          <Card>
            <CardHeader color="success">
              <div style={{ fontSize: "1.5em" }}>Games</div>
            </CardHeader>
            <CardBody>
              {activeTournament?.games &&
                activeTournament?.games.length > 0 && (
                  <DataGrid
                    headerHeight={30}
                    rowHeight={30}
                    autoPageSize
                    getRowId={(row) => row.sequence}
                    rows={activeTournament?.games || []}
                    columns={gamesColumns}
                  />
                )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem {...{ xs: 6 }}>
          <Card>
            <CardHeader color="success">
              <div style={{ fontSize: "1.5em" }}>Table</div>
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
                columns={playerTableColumns}
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
                <GridItem {...{ xs: 6 }}>
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
                        columns={gamesColumns}
                      />
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem {...{ xs: 6 }}>
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
                        columns={playerTableColumns}
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
