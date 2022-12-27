import { Button } from "@mui/material";
import React, { ReactNode } from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { Game, MatchDay, Player, Tournament } from "./Definitions";
import { useNavigate } from "react-router-dom";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@material-ui/icons/ArrowDownwardRounded";
import Box from "@material-ui/core/Box";
import CorrectGameDialog from "views/Matchday/CorrectGameDialog";
import RemoveMatchdayAction from "views/Overview/actions/RemoveMatchdayAction";
import TeamRating from "views/Teams/TeamRating";

export const playerTableColumns: GridColDef[] = [
  {
    field: "rank",
    headerName: "#",
    flex: 0.1,
    sortable: false,
    hideSortIcons: true,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
    renderCell: (params: GridRenderCellParams) => {
      const diff = params.row.previousRank - params.row.rank;
      return (
        <Box display={"flex"} flexDirection="row">
          <div>{params.row.rank}</div>
          {diff > 0 ? (
            <Box color="green" fontSize={10}>
              <ArrowUpwardRoundedIcon fontSize="inherit" />
              {diff}
            </Box>
          ) : diff < 0 ? (
            <Box color="red" fontSize={10}>
              <ArrowDownwardRoundedIcon fontSize="inherit" />
              {Math.abs(diff)}
            </Box>
          ) : (
            <Box color="blue" fontSize={10}></Box>
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
  {
    field: "id",
    headerName: "ID",
    // flex: 0.1,
    width: 30,
    valueGetter: (params: GridValueGetterParams) => Number(params.row.id),
  },
  {
    field: "startDate",
    headerName: "Started at",
    valueGetter: (params: GridValueGetterParams) =>
      new Date(params.row.startDate).toLocaleDateString("de-DE"),
  },
  { field: "state", headerName: "State" },
  { field: "mode", headerName: "Modus" },
  {
    field: "tournament",
    headerName: "# T",
    // flex: 0.3,
    width: 50,
    renderCell: (params: GridRenderCellParams<MatchDay>) =>
      params.row.tournaments.length,
  },
  {
    field: "matches",
    headerName: "# M",
    // flex: 0.3,
    width: 50,
    renderCell: (params: GridRenderCellParams<MatchDay>) =>
      params.row.tournaments.flatMap((t: Tournament) => t.games).length,
  },
  {
    field: "winner",
    headerName: "Winner/Leader",
    // flex: 0.5,
    minWidth: 150,
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
    // flex: 0.3,
    align: "right",
    width: 150,
    renderCell: (params: GridRenderCellParams<MatchDay>) => {
      params.row.id;
      const navigate = useNavigate();
      const onClick = () => {
        navigate(`/matchday/${params.row.id}`);
      };
      return (
        <>
          <Button onClick={onClick}>SHOW</Button>
          <Box>|</Box>
          <RemoveMatchdayAction matchDayId={params.row.id} />
        </>
      );
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
    flex: 0.4,
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
    sortable: false,
    flex: 0.2,
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
    headerName: "GP",
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.gamesPlayed,
  },
  {
    field: "gamesWon",
    headerName: "W",
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => params.row.stats.gamesWon,
  },
  {
    field: "winPercentage",
    headerName: "W%",
    sortable: true,
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.stats.gamesPlayed === 0 ? 0 : params.row.stats.winPercentage,
  },
];

export const teamsColumns: (editable: boolean) => GridColDef[] = (editable) => [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "country", headerName: "Country", flex: 0.5, hideable: true },
  { field: "league", headerName: "League", flex: 1 },
  {
    field: "rating",
    headerName: "Rating",
    flex: 1,
    editable: editable,
    renderCell: (params: GridRenderCellParams<number>) =>
      getStarsRender(params.id, params.value, true),
    renderEditCell: (params: GridRenderCellParams<number>) =>
      getStarsRender(params.id, params.value, false),
  },
];

export function getStarsRender(
  id: string | number,
  value: number | undefined,
  readOnly: boolean
): ReactNode {
  return (
    <TeamRating id={id.toString()} value={value || 3} readOnly={readOnly} />
    // <div style={{ color: "#f7e840" }}>
    //   {value === "5 stars" && (
    //     <>
    //       <StarRounded color="inherit" /> <StarRounded />
    //       <StarRounded /> <StarRounded />
    //       <StarRounded />
    //     </>
    //   )}
    //   {value === "4.5 stars" && (
    //     <>
    //       <StarRounded /> <StarRounded />
    //       <StarRounded /> <StarRounded />
    //       <StarHalfRounded />
    //     </>
    //   )}
    //   {value === "4 stars" && (
    //     <>
    //       <StarRounded /> <StarRounded />
    //       <StarRounded /> <StarRounded />
    //     </>
    //   )}
    //   {value === "3.5 stars" && (
    //     <>
    //       <StarRounded /> <StarRounded />
    //       <StarRounded /> <StarHalfRounded />
    //     </>
    //   )}
    //   {value === "3 stars" && (
    //     <>
    //       <StarRounded /> <StarRounded />
    //       <StarRounded />
    //     </>
    //   )}
    // </div>
  );
}
