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

interface MatchDayProps {
  id: string;
}

const MatchdayView: React.FC<MatchDayProps & MatchDayStoreProps> = ({
  id,
  matchDays,
  setTournamentTeams,
}) => {
  const matchday = matchDays[id];
  if (!matchday) {
    return <h1>{`Matchday with ID ${id} not found!`}</h1>;
  }
  const activeTournament = matchday.tournaments.find(
    (t) => t.state !== "FINISHED"
  );

  if (!activeTournament) {
    return <h1>{`No unfinished tournament found!`}</h1>;
  }
  const createTournament = () => {
    // create Teams
    if (matchday.mode === "1on1") {
      console.log("NOT YET IMPLEMENTED");
    }
    if (matchday.mode === "2on2") {
      const tournamentTeams: TournamentTeam[] = [];

      const games = determineTeamMatesAndTeams(
        matchday,
        tournamentTeams,
        activeTournament
      );

      setTournamentTeams({
        matchdayId: id,
        tournamentId: activeTournament.id,
        tTeams: tournamentTeams,
        games: games,
      });
    }
  };

  return (
    <>
      <div
        style={{ fontWeight: "bold", fontSize: 24, marginBottom: "5pt" }}
      >{`Welcome to Matchday ${id}`}</div>
      <GridContainer>
        <GridItem {...{ xs: 8 }}>
          <Card className="card-content">
            <CardHeader color="success">
              <div style={{ fontSize: "1.5em" }}>Table</div>
            </CardHeader>
            <CardBody>
              <DataGrid
                headerHeight={30}
                rowHeight={30}
                pageSize={matchday.players.length}
                autoHeight
                hideFooter
                getRowId={(row) => row.name}
                rows={matchday.players}
                columns={playerTableColumns}
              />
            </CardBody>
          </Card>
        </GridItem>
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
                    {activeTournament.tournamentTeams.map((tt, index) => {
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            fontWeight: "bold",
                            fontSize: 18,
                            margin: "5pt 0",
                            // justifyContent: "center",
                            // alignItems: "center",
                            width: "100%",
                            textAlign: "center",
                          }}
                        >
                          <div>{tt.players.map((p) => p.name).join(" & ")}</div>
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
                    })}
                  </>
                )}
              </Box>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem {...{ xs: 8 }}>
          <Card>
            <CardHeader color="success">
              <div style={{ fontSize: "1.5em" }}>Games</div>
            </CardHeader>
            <CardBody>
              <DataGrid
                headerHeight={30}
                rowHeight={30}
                autoPageSize
                getRowId={(row) => row.sequence}
                rows={activeTournament.games}
                columns={gamesColumns}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default matchDayConnector(MatchdayView);
