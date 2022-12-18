import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
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
import AutorenewOutlinedIcon from "@material-ui/icons/AutorenewOutlined";

import CloudUploadOutlined from "@material-ui/icons/CloudUploadOutlined";
import GridItem from "components/Grid/GridItem";
import { storeConnector, StoreProps } from "store/StoreReducer";
import { DataGrid } from "@mui/x-data-grid";
import * as XSLX from "xlsx";
import { Team, TeamImport, TeamRating } from "definitions/Definitions";
import CreateMatchDayAction from "./CreateMatchDayAction";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import {
  matchDayColumns,
  overviewPlayersColumns,
  teamsColumns,
} from "definitions/TableDefinitions";
import {
  calulateOverallStats,
  getPlayersSortedByWinPercentage,
} from "utils/TableUtils";

const useStyles = makeStyles(styles);

const Overview: React.FC<StoreProps & MatchDayStoreProps> = ({
  teams,
  setTeams,
  player,
  addPlayer,
  matchDays,
  setPlayers,
}) => {
  const classes = useStyles();

  const [addPlayerOpen, setAddPlayerOpen] = React.useState(false);
  const [name, setName] = React.useState<string>("");
  const [playerError, setPlayerError] = React.useState(true);

  const players = React.useMemo(() => {
    return getPlayersSortedByWinPercentage(Object.values(player));
  }, [player]);
  const handleClick: () => void = () => {
    setAddPlayerOpen((addPlayerOpen) => !addPlayerOpen);
  };

  const handleRecalcStats: () => void = () => {
    setPlayers(calulateOverallStats(Object.values(matchDays)));
  };

  const handlePlayerAdd: () => void = () => {
    addPlayer(name);
    setAddPlayerOpen(false);
    setName("");
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
    const entered = event.target.value;
    setName(entered);
    setPlayerError(!entered || players.map((p) => p?.name).includes(entered));
  };

  return (
    <div>
      <Dialog open={addPlayerOpen} onClose={handleClick}>
        <DialogTitle>Add Player</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            error={playerError}
            margin="normal"
            id="player"
            label="Player to add:"
            type="text"
            value={name}
            onChange={onChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>Cancel</Button>
          <Button onClick={handlePlayerAdd} disabled={playerError}>
            Add
          </Button>
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
        <GridItem {...{ xs: 12, sm: 10, md: 8 }}>
          <Card {...{ height: "300px !important" }}>
            <CardHeader color="info">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div className={classes.cardTitleWhite}>Teams</div>
                <div style={{ flexGrow: 1 }} />
                <IconButton
                  color="primary"
                  aria-label="import Teams"
                  className={classes.cardTitleWhite}
                  onClick={handleClickImport}
                  style={{ padding: "0" }}
                >
                  <CloudUploadOutlined />
                </IconButton>
              </div>
            </CardHeader>
            <CardBody>
              {teams && teams.length > 0 && (
                <DataGrid
                  disableSelectionOnClick
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
        <GridItem {...{ xs: 12, sm: 12, md: 4 }}>
          <Card>
            <CardHeader color="info">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div className={classes.cardTitleWhite}>Player Stats</div>
                <div style={{ flexGrow: 1 }} />
                <IconButton
                  color="primary"
                  aria-label="add player"
                  style={{ padding: "0" }}
                  className={classes.cardTitleWhite}
                  onClick={handleClick}
                >
                  <PersonAdd />
                </IconButton>
                <IconButton
                  color="primary"
                  aria-label="add player"
                  style={{ padding: "0", marginLeft: "10pt" }}
                  className={classes.cardTitleWhite}
                  onClick={handleRecalcStats}
                >
                  <AutorenewOutlinedIcon />
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
                  columns={overviewPlayersColumns}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem {...{ xs: 12, sm: 12, md: 12 }}>
          <Card>
            <CardHeader color="success">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div className={classes.cardTitleWhite}>Matchdays</div>
                <div style={{ flexGrow: 1 }} />
                <CreateMatchDayAction buttonType="ICON" createNewMatchday />
              </div>
            </CardHeader>
            <CardBody>
              {matchDays && Object.values(matchDays).length > 0 && (
                <DataGrid
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "id", sort: "desc" }],
                    },
                  }}
                  disableSelectionOnClick
                  headerHeight={35}
                  rowHeight={30}
                  autoPageSize
                  rows={Object.values(matchDays)}
                  columns={matchDayColumns}
                />
              )}
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
};

export default storeConnector(matchDayConnector(Overview));

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
