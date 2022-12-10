import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { IconButton } from "@material-ui/core";
import PersonAdd from "@material-ui/icons/PersonAdd";
import StarRounded from "@material-ui/icons/StarRounded";
import StarHalfRounded from "@material-ui/icons/StarHalfRounded";
import CloudUploadOutlined from "@material-ui/icons/CloudUploadOutlined";
import GridItem from "components/Grid/GridItem";
import { storeConnector, StoreProps } from "store/StoreReducer";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import * as XSLX from "xlsx";
import { Team, TeamImport, TeamRating } from "definitions/Definitions";
import CreateTournamentAction from "./CreateTournamentAction";

const useStyles = makeStyles(styles);

const Overview: React.FC<StoreProps> = ({
  teams,
  setTeams,
  player,
  addPlayer,
}) => {
  const classes = useStyles();

  const [addPlayerOpen, setAddPlayerOpen] = React.useState(false);
  const [newTournamentOpen, setNewTournamentOpen] = React.useState(false);
  const [name, setName] = React.useState<string>("");

  const players = React.useMemo(() => {
    return Object.values(player);
  }, [player]);
  const handleClick: () => void = () => {
    setAddPlayerOpen((addPlayerOpen) => !addPlayerOpen);
  };

  const handleNewTournamenClick: () => void = () => {
    setNewTournamentOpen((newTournamentOpen) => !newTournamentOpen);
  };

  const handlePlayerAdd: () => void = () => {
    addPlayer(name);
    setAddPlayerOpen(false);
  };

  const [importTeamsOpen, setImportTeamsOpen] = React.useState(false);
  const handleClickImport: () => void = () => {
    setImportTeamsOpen((importTeamsOpen) => !importTeamsOpen);
  };

  const [fileContent, setFileContent] = React.useState<Team[]>([]);
  const handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void = async (e) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      console.log(file);

      const data = await file.arrayBuffer();
      const workbook = XSLX.read(data);

      const workSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: TeamImport[] = XSLX.utils.sheet_to_json(workSheet);

      const teams = jsonData.map((team) => {
        return {
          name: team.Team,
          country: team.Country,
          league: team.League,
          rating: convertRating(team.Rating),
        };
      });
      setFileContent(teams);
    }
  };

  const handleTeamImportSave: () => void = () => {
    setTeams(fileContent);
    setFileContent([]);
    setImportTeamsOpen(false);
  };

  const onChange: (event: React.ChangeEvent<HTMLInputElement>) => void = (
    event
  ) => {
    setName(event.target.value);
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "gamesPlayed", headerName: "Games played", flex: 1 },
    {
      field: "winPercentage",
      headerName: "Win percetage",
      sortable: true,
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        params.row.gamesPlayed === 0
          ? 0
          : params.row.gamesWon / params.row.gamesPlayed,
    },
  ];

  const teamsColumns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "country", headerName: "Country", flex: 1 },
    { field: "league", headerName: "League", flex: 1 },
    {
      field: "rating",
      headerName: "Rating",
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => (
        <div style={{ color: "#f7e840" }}>
          {params.value === "5 stars" && (
            <>
              <StarRounded color="inherit" /> <StarRounded />
              <StarRounded /> <StarRounded />
              <StarRounded />
            </>
          )}
          {params.value === "4.5 stars" && (
            <>
              <StarRounded /> <StarRounded />
              <StarRounded /> <StarRounded />
              <StarHalfRounded />
            </>
          )}
          {params.value === "4 stars" && (
            <>
              <StarRounded /> <StarRounded />
              <StarRounded /> <StarRounded />
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Dialog
        fullWidth
        open={newTournamentOpen}
        onClose={handleNewTournamenClick}
      >
        <DialogTitle>Create new tournament</DialogTitle>
      </Dialog>
      <Dialog open={addPlayerOpen} onClose={handleClick}>
        <DialogTitle>Add Player</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="normal"
            id="player"
            label="Player to add:"
            type="text"
            value={name}
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewTournamenClick}>Cancel</Button>
          <Button onClick={handlePlayerAdd}>Add</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={importTeamsOpen} onClose={handleClickImport}>
        <DialogTitle>Import Teams</DialogTitle>
        <DialogContent>
          <input type={"file"} onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickImport}>Cancel</Button>
          <Button onClick={handleTeamImportSave}>Import</Button>
        </DialogActions>
      </Dialog>
      <GridContainer>
        <GridItem {...{ xs: 14, sm: 12, md: 12 }}>
          <Card>
            <CardHeader color="success">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <h4 className={classes.cardTitleWhite}>Tournaments</h4>
                <div style={{ flexGrow: 1 }} />
                <CreateTournamentAction />
              </div>
            </CardHeader>
            <CardBody>
              {/* <Table
                tableHeaderColor="info"
                tableHead={["Name", "Games Played", "Win Percentage"]}
                tableData={p}
              /> */}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem {...{ xs: 12, sm: 10, md: 8 }}>
          <Card {...{ height: "300px !important" }}>
            <CardHeader color="info">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <h4 className={classes.cardTitleWhite}>Teams</h4>
                <div style={{ flexGrow: 1 }} />
                <IconButton
                  color="primary"
                  aria-label="import Teams"
                  className={classes.cardTitleWhite}
                  onClick={handleClickImport}
                >
                  <CloudUploadOutlined />
                </IconButton>
              </div>
            </CardHeader>
            <CardBody>
              {teams && teams.length > 0 && (
                <DataGrid
                  headerHeight={35}
                  autoPageSize
                  rowHeight={30}
                  getRowId={(row) => row.name}
                  rows={teams}
                  columns={teamsColumns}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem {...{ xs: 6, sm: 6, md: 4 }}>
          <Card>
            <CardHeader color="info">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <h4 className={classes.cardTitleWhite}>Player Stats</h4>
                <div style={{ flexGrow: 1 }} />
                <IconButton
                  color="primary"
                  aria-label="add player"
                  className={classes.cardTitleWhite}
                  onClick={handleClick}
                >
                  <PersonAdd />
                </IconButton>
              </div>
            </CardHeader>
            <CardBody>
              {players && players.length > 0 && (
                <DataGrid
                  headerHeight={45}
                  rowHeight={40}
                  hideFooter
                  autoHeight
                  getRowId={(row) => row.name}
                  rows={players}
                  columns={columns}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default storeConnector(Overview);

function convertRating(Rating: any): TeamRating {
  switch (Rating) {
    case 5:
      return "5 stars";
    case 4.5:
      return "4.5 stars";
    case 4:
      return "4 stars";
    case 3.5:
      return "3.5 stars";
    default:
      return "3 stars";
  }
}
