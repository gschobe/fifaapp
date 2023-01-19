import GridContainer from "components/Grid/GridContainer";
import React from "react";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import { storeConnector, StoreProps } from "store/StoreReducer";

import { Game, MatchDay } from "definitions/Definitions";
import Kpi from "./Kpi";
import Divider from "@mui/material/Divider";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import TableChartIcon from "@mui/icons-material/TableChart";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { playerTableColumns } from "definitions/TableDefinitions";
import { calulateOverallStats } from "utils/TableUtils";
import { getPlayerStats, getTeamAndGameStats } from "./StatsUtil";
import { tournamenTeamComp } from "views/Matchday/GameScore";
import MatchDayFilterAccordion from "./MatchDayFilterAccordion";

const StatsPage: React.FC<MatchDayStoreProps & StoreProps> = ({
  matchDays,
}) => {
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>();

  const [matchdays, setMatchDays] = React.useState<(MatchDay | undefined)[]>();

  React.useEffect(() => {
    const mds = Object.values(matchDays).filter(
      (md) => md?.state !== "DELETED"
    );
    setMatchDays(mds);
    setSelectionModel(mds.map((md) => md?.id || ""));
  }, [matchDays]);

  const selectedMatchdays = React.useMemo(() => {
    return matchdays?.filter((md) => md && selectionModel?.includes(md.id));
  }, [selectionModel]);

  const players = React.useMemo(() => {
    return selectedMatchdays
      ? Object.values(calulateOverallStats(selectedMatchdays, []))
      : [];
  }, [selectedMatchdays]);

  const playerStats = React.useMemo(() => {
    return getPlayerStats(players);
  }, [players]);

  const teamAndGameStats = React.useMemo(() => {
    return selectedMatchdays
      ? getTeamAndGameStats(selectedMatchdays, players)
      : { team: {}, game: {} };
  }, [selectedMatchdays]);

  return (
    <>
      <MatchDayFilterAccordion
        matchdays={matchdays}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
      />
      <Accordion style={{ borderRadius: " 0 0 4px 4px" }}>
        <AccordionSummary expandIcon={<TableChartIcon />}>
          <Typography style={{ width: "33%", flexShrink: 0 }}>
            Player Table
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DataGrid
            disableSelectionOnClick
            hideFooter
            headerHeight={35}
            rowHeight={30}
            pageSize={players.length}
            autoHeight
            getRowId={(row) => row.name}
            rows={players}
            columns={playerTableColumns(true)}
          />
        </AccordionDetails>
      </Accordion>
      <GridContainer>
        <Kpi
          value={selectedMatchdays?.length}
          text={"Matchdays"}
          kpiLabel={"# Matchdays"}
          color="info"
          withLabel={false}
        />
        <Kpi
          value={selectedMatchdays?.flatMap((md) => md?.tournaments).length}
          text={"Tournaments"}
          kpiLabel={""}
          color="info"
          withLabel={false}
        />
        <Kpi
          value={
            selectedMatchdays?.flatMap((md) =>
              md?.tournaments.flatMap((t) => t.games)
            ).length
          }
          text={"Games"}
          kpiLabel={""}
          color="info"
          withLabel={false}
          md={2}
          lg={2}
        />
        <Kpi
          value={teamAndGameStats.game.numTies}
          text={"Ties"}
          kpiLabel={""}
          color="info"
          withLabel={false}
          md={2}
          lg={2}
        />
        <Kpi
          value={teamAndGameStats.team.numberOfTeams}
          text={"Teams"}
          kpiLabel={""}
          color="info"
          withLabel={false}
          md={2}
          lg={2}
        />
      </GridContainer>

      <Divider style={{ marginTop: "15pt", marginBottom: "5pt" }} />
      <GridContainer>
        <Kpi
          value={teamAndGameStats.mostMdWins?.wins}
          text={teamAndGameStats.mostMdWins?.name.join(", ")}
          kpiLabel={"Most Matchday Won"}
          color="info"
          md={4}
          lg={4}
        />
        <Kpi
          value={`${teamAndGameStats.mostWins?.wins} | ${teamAndGameStats.leastWins?.wins}`}
          text={`${teamAndGameStats.mostWins?.name.join(
            ", "
          )} | ${teamAndGameStats.leastWins?.name.join(", ")}`}
          kpiLabel={"Games Won (Most | Least)"}
          color="info"
          md={4}
          lg={4}
        />
        <Kpi
          value={`${teamAndGameStats.mostLoss?.losses} | ${teamAndGameStats.leastLoss?.losses}`}
          text={`${teamAndGameStats.mostLoss?.name.join(
            ", "
          )} | ${teamAndGameStats.leastLoss?.name.join(", ")}`}
          kpiLabel={"Games Lost (Most | Least)"}
          color="info"
          md={4}
          lg={4}
        />
        <Kpi
          value={playerStats.mppg?.stats?.pointsPerGame || 0}
          text={playerStats.mppg?.name}
          kpiLabel={"Most Points Per Game"}
          color="success"
        />
        <Kpi
          value={playerStats.lppg?.stats?.pointsPerGame || 0}
          text={playerStats.lppg?.name}
          kpiLabel={"Least Points Per Game"}
          color="warning"
        />
        <Kpi
          value={playerStats.gpg?.stats?.goalsPerGame || 0}
          text={playerStats.gpg?.name}
          kpiLabel={"Most Goals Per Game"}
          color="success"
        />
        <Kpi
          value={playerStats.gapg?.stats?.goalsAgainstPerGame || 0}
          text={playerStats.gapg?.name}
          kpiLabel={"Most Goals Against Per Game"}
          color="warning"
        />
      </GridContainer>
      <Divider style={{ marginTop: "15pt", marginBottom: "5pt" }} />
      <GridContainer>
        <Kpi
          value={teamAndGameStats.team.numberOfTeams}
          text={"Teams"}
          kpiLabel={"Number of teams played"}
          color="info"
        />
        <Kpi
          value={teamAndGameStats.team.mostGames?.games || 0}
          text={teamAndGameStats.team.mostGames?.name || ""}
          kpiLabel={"Most Played Team"}
          color="success"
        />
        <Kpi
          value={
            teamAndGameStats.team.mostWon
              ? `${teamAndGameStats.team.mostWon?.won}/${teamAndGameStats.team.mostWon?.games}`
              : "0"
          }
          text={teamAndGameStats.team.mostWon?.name || ""}
          kpiLabel={"Team With Most Wins"}
          color="success"
        />
        <Kpi
          value={
            teamAndGameStats.team.leastWon
              ? `${teamAndGameStats.team.leastWon?.won}/${teamAndGameStats.team.leastWon?.games}`
              : 0
          }
          text={teamAndGameStats.team.leastWon?.name || ""}
          kpiLabel={"Team With Least Wins"}
          color="warning"
        />
      </GridContainer>
      <Divider style={{ marginTop: "15pt", marginBottom: "5pt" }} />
      <GridContainer>
        <Kpi
          value={
            teamAndGameStats.game.mostGoals?.games[0]
              ? `${teamAndGameStats.game.mostGoals?.games[0]?.goalsHome}:${teamAndGameStats.game.mostGoals?.games[0]?.goalsAway}`
              : "-"
          }
          text={getTeamsRender(teamAndGameStats.game.mostGoals?.games[0])}
          kpiLabel={"Game with most goals"}
          color="primary"
          withLabel={true}
          md={6}
          lg={6}
        />
        <Kpi
          value={
            teamAndGameStats.game.highestDif?.games[0]
              ? `${teamAndGameStats.game.highestDif?.games[0]?.goalsHome}:${teamAndGameStats.game.highestDif?.games[0]?.goalsAway}`
              : "-"
          }
          text={getTeamsRender(teamAndGameStats.game.highestDif?.games[0])}
          kpiLabel={"Game with highest goals difference"}
          color="primary"
          withLabel={true}
          md={6}
          lg={6}
        />
      </GridContainer>
    </>
  );
};

export default storeConnector(matchDayConnector(StatsPage));

function getTeamsRender(game: Game | undefined): React.ReactNode {
  if (game) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginTop: "10pt",
          width: "100%",
        }}
      >
        {tournamenTeamComp(1, game.homePlayer, "column")}
        <div
          style={{
            fontWeight: "bolder",
            fontSize: 20,
            margin: "0 10pt",
          }}
        >
          {"vs"}
        </div>
        {tournamenTeamComp(2, game.awayPlayer, "column")}
      </div>
    );
  }
}
