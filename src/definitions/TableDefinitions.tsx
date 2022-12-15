import { Button } from "@mui/material";
import React, { ReactNode } from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Game, MatchDay, Player, Tournament } from "./Definitions";
import { useNavigate } from "react-router-dom";
import StarRounded from "@material-ui/icons/StarRounded";
import StarHalfRounded from "@material-ui/icons/StarHalfRounded";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import Box from "@material-ui/core/Box";
import CorrectGameDialog from "views/Matchday/CorrectGameDialog";

export const playerTableColumns: GridColDef[] = [
  {
    field: "rangchange",
    headerName: "",
    flex: 0.1,
    align: "center",
    renderCell: (params: GridRenderCellParams<MatchDay>) => {
      const diff = params.row.previousRank - params.row.rank;
      return (
        <Box display={"flex"} flexDirection="row">
          {diff > 0 ? (
            <Box color="green">
              <ArrowUpwardRoundedIcon fontSize="small" />
              {diff}
            </Box>
          ) : diff < 0 ? (
            <Box color="red">
              <ArrowDownwardRoundedIcon fontSize="small" />
              {Math.abs(diff)}
            </Box>
          ) : (
            <Box color="blue">-</Box>
          )}
        </Box>
      );
    },
  },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "points",
    headerName: "Points",
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.points || 0,
  },
  {
    field: "gamesPlayed",
    headerName: "GP",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.gamesPlayed,
  },
  {
    field: "win",
    headerName: "W",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) => params.row.stats.gamesWon,
  },
  {
    field: "tie",
    headerName: "T",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) => params.row.stats.gamesTie,
  },
  {
    field: "lost",
    headerName: "L",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) => params.row.stats.gamesLost,
  },
  {
    field: "goalsScored",
    headerName: "GS",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.goalsScored,
  },
  {
    field: "goalsAgainst",
    headerName: "GA",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.goalsAgainst,
  },
  {
    field: "goalDif",
    headerName: "DIF",
    sortable: true,
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.gamesPlayed === 0
        ? 0
        : params.row.stats.goalsScored - params.row.stats.goalsAgainst,
  },
];

export const matchDayColumns: GridColDef[] = [
  { field: "id", headerName: "ID", flex: 0.1 },
  {
    field: "startDate",
    headerName: "Started at",
    flex: 0.2,
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.startDate).toLocaleDateString("de-DE"),
  },
  { field: "state", headerName: "State", flex: 0.15 },
  { field: "mode", headerName: "Modus", flex: 0.15 },
  {
    field: "tournament",
    headerName: "# Tournaments",
    flex: 0.2,
    renderCell: (params: GridRenderCellParams<MatchDay>) =>
      params.row.tournaments.length,
  },
  {
    field: "matches",
    headerName: "# Matches",
    flex: 0.2,
    renderCell: (params: GridRenderCellParams<MatchDay>) =>
      params.row.tournaments.flatMap((t: Tournament) => t.games).length,
  },
  {
    field: "winner",
    headerName: "Matchday Winner/Leader",
    flex: 0.4,
    valueGetter: (params: GridValueGetterParams<MatchDay>) =>
      params.row.players.find((p: Player) => p.rank === 1)?.name,
  },
  {
    field: "players",
    headerName: "Players",
    flex: 1,
    renderCell: (params: GridRenderCellParams<MatchDay>) =>
      params.row.players
        .map((p: Player) => p.name)
        .sort()
        .join(", "),
  },

  {
    field: "actions",
    headerName: "",
    flex: 0.25,
    align: "right",
    renderCell: (params: GridRenderCellParams<MatchDay>) => {
      params.row.id;
      const navigate = useNavigate();
      const onClick = () => {
        navigate(`/matchday/${params.row.id}`);
      };
      return <Button onClick={onClick}>SHOW</Button>;
    },
  },
];

export const gamesColumns: GridColDef[] = [
  {
    field: "id",
    headerName: "#",
    flex: 0.1,
    valueGetter: (params: GridValueGetterParams) => params.row.sequence,
  },
  {
    field: "home",
    headerName: "HOME",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.homePlayer.team.name,
  },
  {
    field: "result",
    headerName: "Result",
    flex: 0.25,
    align: "center",
    headerAlign: "center",
    valueGetter: (params: GridValueGetterParams) =>
      ["UPCOMING", "OPEN"].includes(params.row.state)
        ? "-:-"
        : `${params.row.goalsHome} : ${params.row.goalsAway}${
            params.row.state === "RUNNING" ? ` (Live)` : ""
          }`,
  },
  {
    field: "away",
    headerName: "AWAY",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.awayPlayer.team.name,
  },
  {
    field: "actions",
    headerName: "",
    flex: 0.25,
    renderCell: (params: GridRenderCellParams<Game>) => {
      return params.row.state === "FINISHED" ? (
        <CorrectGameDialog game={params.row} />
      ) : null;
    },
  },
];

export const overviewPlayersColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "gamesPlayed",
    headerName: "Games played",
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.gamesPlayed,
  },
  {
    field: "gamesWon",
    headerName: "Won",
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.stats.gamesWon,
  },
  {
    field: "winPercentage",
    headerName: "Win percetage",
    sortable: true,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.gamesPlayed === 0 ? 0 : params.row.stats.winPercentage,
  },
];

export const teamsColumns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "country", headerName: "Country", flex: 1 },
  { field: "league", headerName: "League", flex: 1 },
  {
    field: "rating",
    headerName: "Rating",
    flex: 1,
    renderCell: (params: GridRenderCellParams<string>) =>
      getStarsRender(params.value),
  },
];

export function getStarsRender(value: string | undefined): ReactNode {
  return (
    <div style={{ color: "#f7e840" }}>
      {value === "5 stars" && (
        <>
          <StarRounded color="inherit" /> <StarRounded />
          <StarRounded /> <StarRounded />
          <StarRounded />
        </>
      )}
      {value === "4.5 stars" && (
        <>
          <StarRounded /> <StarRounded />
          <StarRounded /> <StarRounded />
          <StarHalfRounded />
        </>
      )}
      {value === "4 stars" && (
        <>
          <StarRounded /> <StarRounded />
          <StarRounded /> <StarRounded />
        </>
      )}
      {value === "3.5 stars" && (
        <>
          <StarRounded /> <StarRounded />
          <StarRounded /> <StarHalfRounded />
        </>
      )}
      {value === "3 stars" && (
        <>
          <StarRounded /> <StarRounded />
          <StarRounded />
        </>
      )}
    </div>
  );
}
