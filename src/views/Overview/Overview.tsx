import { IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AutorenewOutlinedIcon from "@material-ui/icons/AutorenewOutlined";
import PersonAdd from "@material-ui/icons/PersonAdd";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import GridContainer from "components/Grid/GridContainer.js";
import React from "react";

import { DataGrid } from "@mui/x-data-grid";
import GridItem from "components/Grid/GridItem";
import {
  matchDayColumns,
  playerTableColumns,
} from "definitions/TableDefinitions";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import { storeConnector, StoreProps } from "store/StoreReducer";
import {
  calulateOverallStats,
  getPlayersSortedByWinPercentage,
} from "utils/TableUtils";
import CreateMatchDayAction from "./actions/CreateMatchDayAction";
import ExportMatchdayDataAction from "./actions/ExportMatchdayDataAction";
import AddPlayerModal from "./CreateComponents/AddPlayerModal";

const useStyles = makeStyles(styles);

const Overview: React.FC<StoreProps & MatchDayStoreProps> = ({
  player,
  matchDays,
  setPlayers,
}) => {
  const classes = useStyles();

  const matchdays = React.useMemo(() => {
    return Object.values(matchDays).filter(
      (md) => md && md.state !== "DELETED"
    );
  }, [matchDays]);

  const [addPlayerOpen, setAddPlayerOpen] = React.useState(false);

  const players = React.useMemo(() => {
    return getPlayersSortedByWinPercentage(Object.values(player));
  }, [player]);
  const handleClick: () => void = () => {
    setAddPlayerOpen((addPlayerOpen) => !addPlayerOpen);
  };

  const handleRecalcStats: () => void = () => {
    setPlayers(calulateOverallStats(matchdays, Object.values(player)));
  };

  return (
    <div>
      <AddPlayerModal open={addPlayerOpen} close={handleClick} game="FIFA" />
      <GridContainer>
        <GridItem {...{ xs: 12, sm: 12, md: 12 }}>
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
                  columns={playerTableColumns(true)}
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
                <ExportMatchdayDataAction />
                <CreateMatchDayAction buttonType="ICON" createNewMatchday />
              </div>
            </CardHeader>
            <CardBody>
              {matchdays && matchdays.length > 0 && (
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
                  rows={matchdays}
                  columns={matchDayColumns(false)}
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
