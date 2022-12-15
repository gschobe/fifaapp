import React from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import Card from "components/Card/Card.js";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CardHeader from "components/Card/CardHeader";
import CardBody from "components/Card/CardBody";
import { Box, Button, TextField } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { gamesColumns, playerTableColumns } from "definitions/TableDefinitions";
import { TournamentTeam } from "definitions/Definitions";
import determineTeamMatesAndTeams from "utils/DrawUtils";
import { CardActions } from "@mui/material";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import CreateMatchDayAction from "views/Overview/CreateMatchDayAction";
import { getPlayersSortedByPoints } from "utils/TableUtils";

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
}) => {
  const matchday = matchDays[id];
  if (!matchday) {
    return <h1>{`Matchday with ID ${id} not found!`}</h1>;
  }
  console.log("live");
  const activeTournament = matchday.tournaments.find(
    (t) => t.state !== "FINISHED"
  );

  const mdPlayers = getPlayersSortedByPoints(matchday.players);

  // if (!activeTournament) {
  //   return <h1>{`No unfinished tournament found!`}</h1>;
  // }
  const createTournament = () => {
    // create Teams
    const tournamentTeams: TournamentTeam[] = [];
    if (activeTournament !== undefined) {
      const games = determineTeamMatesAndTeams(
        matchday,
        tournamentTeams,
        activeTournament
      );

      setTournamentTeams({
        matchdayId: id,
        tournamentId: activeTournament?.id,
        tTeams: tournamentTeams,
        games: games,
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
        {!liveGame && !upcomingGame && (
          <>
            <CreateMatchDayAction
              buttonType="TEXT"
              createNewMatchday={false}
              activeMatchday={matchday}
            />
            <Button variant="outlined" color="secondary">
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div>{tournamenTeamComp(1, liveGame?.homePlayer)}</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      margin: "5pt 0",
                    }}
                  >
                    <TextField
                      key={"homeScore"}
                      value={liveGame.goalsHome}
                      variant="outlined"
                      inputMode="numeric"
                      onChange={handleHomeScoreChange}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                      inputProps={{
                        style: {
                          width: "40px",
                          textAlign: "center",
                          fontSize: 30,
                          margin: 0,
                          padding: "4px 4px",
                        },
                      }}
                    />
                    <div
                      style={{
                        fontWeight: "bolder",
                        fontSize: 20,
                        margin: "0 10pt",
                      }}
                    >
                      {":"}
                    </div>
                    <TextField
                      key={"awayScore"}
                      value={liveGame.goalsAway}
                      variant="outlined"
                      inputMode="numeric"
                      onChange={handleAwayScoreChange}
                      onFocus={(event) => {
                        event.target.select();
                      }}
                      inputProps={{
                        style: {
                          width: "40px",
                          textAlign: "center",
                          fontSize: 30,
                          margin: 0,
                          padding: "4px 4px",
                        },
                      }}
                    />
                  </div>
                  <div>{tournamenTeamComp(2, liveGame?.awayPlayer)}</div>
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
    </>
  );
};

export default matchDayConnector(MatchdayView);

const tournamenTeamComp = (index: number, tt: TournamentTeam) => {
  return (
    <div
      key={index}
      style={{
        display: "flex",
        flexDirection: "row",
        fontWeight: "bold",
        fontSize: 18,
        margin: "5pt 0",
        width: "100%",
        textAlign: "center",
      }}
    >
      <div>{tt.players.map((p) => p?.name).join(" & ")}</div>
      <div style={{ padding: "0 5pt" }}>{`|`}</div>
      <div
        style={{
          fontStyle: "italic",
          color: "grey",
        }}
      >
        {tt.team?.name}
      </div>
    </div>
  );
};
