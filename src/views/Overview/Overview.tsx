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

import GridItem from "components/Grid/GridItem";
import { storeConnector, StoreProps } from "store/StoreReducer";
import { DataGrid } from "@mui/x-data-grid";
import CreateMatchDayAction from "./actions/CreateMatchDayAction";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import {
  matchDayColumns,
  playerTableColumns,
} from "definitions/TableDefinitions";
import {
  calulateOverallStats,
  getPlayersSortedByWinPercentage,
} from "utils/TableUtils";
import { RoundRobin } from "tournament-pairings";
import { Match } from "tournament-pairings/dist/Match";
import ExportMatchdayDataAction from "./actions/ExportMatchdayDataAction";

const useStyles = makeStyles(styles);

const Overview: React.FC<StoreProps & MatchDayStoreProps> = ({
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
    const matches = RoundRobin(5, 1, true);
    const teams = matches
      .filter((m) => m.player1 !== null && m.player2 !== null)
      .map((t: Match, index) => {
        return {
          team: index + 1,
          players: [t.player1?.toString() || "", t.player2?.toString() || ""],
        };
      });

    console.log(teams);
    const games = RoundRobin(teams.length, 1, true);

    const filteredGames = games
      .filter((g: Match) => {
        const t1 = teams[Number(g.player1) - 1 || 0];
        const t2 = teams[Number(g.player2) - 1 || 0];
        const players = t1.players.concat(
          t2.players.filter((p) => t1.players.indexOf(p) < 0)
        );
        return players.length === 4;
      })
      .map((g) => {
        const t1_id = Number(g.player1);
        const t2_id = Number(g.player2);
        const t1: string[] = teams[t1_id - 1].players;
        const t2: string[] = teams[t2_id - 1].players;
        return {
          t1: { team: t1_id, players: t1 },
          t2: { team: t2_id, players: t2 },
          pause: ["1", "2", "3", "4", "5"]
            .filter((p) => t1.concat(t2).indexOf(p) < 0)
            .at(0),
        };
      });
    console.log(filteredGames);

    let pause = 1;
    const sequencedGames = [];
    for (let i = 1; sequencedGames.length < 15; i++) {
      const game = filteredGames.find((g) => g.pause === pause.toString());
      if (game) {
        filteredGames.splice(filteredGames.indexOf(game), 1);
        sequencedGames.push({ sequence: i, game: game });
      }
      pause === 5 ? (pause = 1) : pause++;
    }

    console.log(sequencedGames);

    setAddPlayerOpen((addPlayerOpen) => !addPlayerOpen);
  };

  const handleRecalcStats: () => void = () => {
    setPlayers(
      calulateOverallStats(Object.values(matchDays), Object.values(player))
    );
  };

  const handlePlayerAdd: () => void = () => {
    addPlayer(name);
    setAddPlayerOpen(false);
    setName("");
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
