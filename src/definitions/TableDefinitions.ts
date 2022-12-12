import {
  GridColDef,
  GridRenderCellParams,
  //   GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { MatchDay, Player } from "./Definitions";
// import { MatchDay, Player } from "./Definitions";

export const playerTableColumns: GridColDef[] = [
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
  { field: "state", headerName: "State", flex: 0.25 },
  { field: "mode", headerName: "Modus", flex: 0.25 },
  {
    field: "players",
    headerName: "Players",
    flex: 1,
    renderCell: (params: GridRenderCellParams<MatchDay>) =>
      params.row.players.map((p: Player) => p.name).join(", "),
  },
  {
    field: "tournament",
    headerName: "# Tournaments",
    flex: 1,
    renderCell: (params: GridRenderCellParams<MatchDay>) =>
      params.row.tournaments.length,
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
      params.row.state !== "FINISHED"
        ? "-:-"
        : `${params.row.goalsHome} : ${params.row.goalsAway}`,
  },
  {
    field: "away",
    headerName: "AWAY",
    flex: 0.5,
    valueGetter: (params: GridValueGetterParams) =>
      params.row.awayPlayer.team.name,
  },
];
