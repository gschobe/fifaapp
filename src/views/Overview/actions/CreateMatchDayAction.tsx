import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { storeConnector, StoreProps } from "store/StoreReducer";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import IconButton from "@material-ui/core/IconButton";
import AddBoxOutlined from "@material-ui/icons/AddBoxOutlined";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import DialogContent from "@material-ui/core/DialogContent";
import {
  MatchDay,
  Player,
  Team,
  Tournament,
  TournamentMode,
} from "definitions/Definitions";
import DialogContentText from "@mui/material/DialogContentText";
import { Button } from "@mui/material";
import TournamentSettings from "../CreateComponents/TournamentSettings";
import MatchDaySettings from "../CreateComponents/MatchDaySettings";
import { useNavigate } from "react-router-dom";
import { generatePossibleDraws } from "utils/DrawUtils";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { teamsColumns } from "definitions/TableDefinitions";

const useStyles = makeStyles(styles);

export interface CreatProps {
  buttonType: "ICON" | "TEXT";
  createNewMatchday: boolean;
  activeMatchday?: MatchDay;
}

const CreateMatchDayAction: React.FC<
  CreatProps & StoreProps & MatchDayStoreProps
> = ({
  buttonType,
  createNewMatchday,
  activeMatchday,
  player,
  addMatchDay,
  matchDays,
  teams,
  addTournament,
}) => {
  const navigate = useNavigate();
  const players = React.useMemo(() => {
    return Object.values(player);
  }, [player]);
  const allLeagues = React.useMemo(() => {
    const leagues = Object.values(teams).map((t) => getLeageString(t));
    return Array.from(new Set(leagues));
  }, [teams]);
  const allOVA = React.useMemo(() => {
    const ova = Object.values(teams).map((t) => t?.OVA || 0);
    return Array.from(new Set(ova));
  }, [teams]);

  const classes = useStyles();
  const [playerName, setPlayerName] = React.useState<string[]>([]);
  const [location, setLocation] = React.useState<string>();
  const [ratings, setRatings] = React.useState<number[]>([]);
  const [selectedLeagues, setSelectedLeagues] = React.useState<string[]>([]);
  const [selectedOva, setSelectedOva] = React.useState<number[]>([]);
  const [includeSecondRound, setIncludeSecondRound] = React.useState(
    activeMatchday?.tournaments
      ? activeMatchday?.tournaments[activeMatchday?.tournaments.length - 1]
          .withSecondRound
      : false
  );
  const [reuseTeamsSelection, setReuseTeamsSelection] = React.useState(
    activeMatchday?.tournaments ? activeMatchday.tournaments.length > 0 : false
  );

  const [newTournamentOpen, setNewTournamentOpen] = React.useState(false);

  const [activeStep, setActiveStep] = React.useState(0);

  const [selectedTeams, setSelectedTeams] = React.useState<
    (Team | undefined)[]
  >(
    reuseTeamsSelection && activeMatchday
      ? [
          ...activeMatchday?.tournaments[activeMatchday?.tournaments.length - 1]
            .useableTeams,
        ]
      : []
  );
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>(
    selectedTeams ? selectedTeams.map((t) => t?.name || "") : []
  );

  const handleNewTournamenClick: () => void = () => {
    setNewTournamentOpen((newTournamentOpen) => !newTournamentOpen);
  };

  const handleIncludeSecondRoundChanged: (event: any) => void = (event) => {
    setIncludeSecondRound(event.target.checked);
  };
  const handleReuseTeamsSelectionChanged: (event: any) => void = (event) => {
    setReuseTeamsSelection(event.target.checked);
    if (event.target.checked && activeMatchday) {
      const selectedTeams = [
        ...activeMatchday?.tournaments[activeMatchday?.tournaments.length - 1]
          .useableTeams,
      ];
      setSelectedTeams(selectedTeams);
      setSelectionModel(() => selectedTeams.map((t) => t?.name || ""));
    }
  };

  const steps = createNewMatchday
    ? [
        "Select matchday settings",
        "Select tournament settings",
        "Create tournament",
      ]
    : ["Select Teams", "Create tournament"];

  const [mode, setMode] = React.useState<TournamentMode>();
  const handleChange = (event: any) => {
    setMode(event.target.value);
  };

  const handleSelectionChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    const players = typeof value === "string" ? value.split(",") : value;
    setPlayerName(players.filter((p: Player) => !!p));
  };

  const handleLocationChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    setLocation(value);
  };

  const handleRatingSelectionChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    const ratings = typeof value === "string" ? value.split(",") : value;
    setRatings(ratings.filter((r: string) => r !== undefined));
  };

  const handleLeagueSelectionChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    const selected = typeof value === "string" ? value.split(",") : value;
    setSelectedLeagues(selected.filter((s: string) => s !== undefined));
  };
  const handleOvaSelectionChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    const selected = typeof value === "string" ? value.split(",") : value;
    setSelectedOva(selected.filter((s: number) => s !== undefined));
  };

  const updateSelectedTeams = () => {
    const selectedTeams = [
      ...Object.values(teams).filter(
        (team) =>
          team &&
          (ratings.length === 0 ? true : ratings.includes(team.rating)) &&
          (selectedLeagues.length === 0
            ? true
            : selectedLeagues.includes(getLeageString(team))) &&
          (selectedOva.length === 0
            ? true
            : selectedOva.includes(team.OVA || 0))
      ),
    ];
    setSelectedTeams(selectedTeams);
    setSelectionModel(() => selectedTeams.map((t) => t?.name || ""));
  };

  const handleNext = () => {
    updateSelectedTeams();
    if (activeStep === steps.length - 1) {
      const matchdayPlayers = createNewMatchday
        ? newPlayers(playerName)
        : activeMatchday?.players || [];

      const usabeleTeams =
        reuseTeamsSelection && activeMatchday
          ? activeMatchday.tournaments[activeMatchday.tournaments.length - 1]
              .useableTeams
          : [
              ...Object.values(teams).filter(
                (team) => team && selectionModel.includes(team.name)
                // &&
                // !activeMatchday?.usedTeams.includes(team)
              ),
            ];
      const tournament: Tournament = {
        id: createNewMatchday
          ? "1"
          : ((activeMatchday?.tournaments.length || 0) + 1).toString(),
        tournamentTeams: [],
        players: newPlayers(matchdayPlayers.map((p) => p.name)),
        games: [],
        state: "NEW",
        withSecondRound: includeSecondRound,
        useableTeams: usabeleTeams,
      };
      if (createNewMatchday) {
        const id =
          Object.keys(matchDays).length === 0
            ? 1
            : Math.max(
                ...Object.keys(matchDays)
                  .filter((id) => !isNaN(parseInt(id)))
                  .map((id) => Number(id))
              ) + 1;
        const matchday: MatchDay = {
          id: id.toString(),
          startDate: new Date().toISOString(),
          at: location ? player[location] : undefined,
          players: matchdayPlayers,
          mode: mode || "2on2",
          usedTeams: [],
          tournaments: [tournament],
          state: "NEW",
          possibleDraws: generatePossibleDraws(matchdayPlayers, mode),
          meta: {},
        };
        addMatchDay(matchday);
        navigate(`/matchday/${id}`);
      } else if (activeMatchday) {
        addTournament({
          matchdayId: activeMatchday?.id,
          tournament: tournament,
        });
      }
      setActiveStep(0);
      resetStates();
      setNewTournamentOpen(false);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  function resetStates() {
    setIncludeSecondRound(false);
    setMode(undefined);
    setPlayerName([]);
    setRatings([]);
    setSelectedLeagues([]);
  }

  const handleBack = () => {
    if (activeStep === 0) {
      resetStates();
      handleNewTournamenClick();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const showMdSettings = createNewMatchday && activeStep === 0;
  const showTSettings =
    (createNewMatchday && activeStep === 1) ||
    (!createNewMatchday && activeStep === 0);
  const showTeamsSelection =
    (createNewMatchday && activeStep === 2) ||
    (!createNewMatchday && activeStep === 1);

  const buttonDisabled =
    (showTeamsSelection && selectedTeams.length === 0) || //
    (showTSettings &&
      selectedOva.length === 0 &&
      selectedLeagues.length === 0 &&
      ratings.length === 0 &&
      !reuseTeamsSelection) ||
    (showMdSettings &&
      (mode === undefined ||
        playerName.length < 2 ||
        (mode === "2on2" &&
          (playerName.length < 4 || playerName.length % 2 !== 0)) ||
        (mode === "2on2-odd" && ![5, 7].includes(playerName.length))));

  return (
    <>
      <Dialog
        fullWidth
        open={newTournamentOpen}
        onClose={handleNewTournamenClick}
      >
        <DialogTitle>
          {createNewMatchday ? "Create new matchday" : "Create new tournament"}
        </DialogTitle>
        <DialogContentText style={{ paddingLeft: "20px" }}>
          {createNewMatchday
            ? "Define your matchday and inital tournament settings."
            : "Define your tournament settings."}
        </DialogContentText>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {showMdSettings && (
            <MatchDaySettings
              playerName={playerName}
              handleSelectionChange={handleSelectionChange}
              handleModeChange={handleChange}
              mode={mode}
              players={players}
              handleLocaitonSelectionChange={handleLocationChange}
            />
          )}
          {showTSettings && (
            <TournamentSettings
              ratings={ratings}
              handleRatingSelectionChange={handleRatingSelectionChange}
              handleIncludeChanged={handleIncludeSecondRoundChanged}
              includeSecondRound={includeSecondRound}
              reuseTeamsSelection={reuseTeamsSelection}
              handleReuseTeamsSelection={handleReuseTeamsSelectionChanged}
              lastTournamentExists={
                activeMatchday ? activeMatchday.tournaments.length > 0 : false
              }
              leagues={allLeagues}
              selectedLeagues={selectedLeagues}
              handleLeagueChange={handleLeagueSelectionChange}
              ova={allOVA}
              selectedOva={selectedOva}
              handleOvaSelectionChange={handleOvaSelectionChange}
            />
          )}
          <Box
            style={{ display: "flex", flexDirection: "row", paddingTop: 10 }}
          >
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              {activeStep === 0 ? "Cancel" : "Back"}
            </Button>
            <Box style={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext} disabled={buttonDisabled}>
              {activeStep === steps.length - 1 ? "Create" : "Next"}
            </Button>
          </Box>
          {showTeamsSelection && (
            <DataGrid
              checkboxSelection
              selectionModel={selectionModel}
              autoHeight
              headerHeight={35}
              rowHeight={30}
              getRowId={(row) => row.name}
              rows={selectedTeams}
              columns={teamsColumns(false)}
              onSelectionModelChange={(newSelectionModel) => {
                setSelectionModel(newSelectionModel);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {buttonType === "ICON" ? (
        <IconButton
          color="primary"
          aria-label="add player"
          className={classes.cardTitleWhite}
          onClick={handleNewTournamenClick}
          style={{ padding: "0 5pt" }}
        >
          <AddBoxOutlined />
        </IconButton>
      ) : (
        <Button
          variant="outlined"
          color="secondary"
          style={{ margin: "0 5pt" }}
          onClick={handleNewTournamenClick}
        >
          Start New TOURNAMENT
        </Button>
      )}
    </>
  );
};

export default storeConnector(matchDayConnector(CreateMatchDayAction));

function getLeageString(t: Team | undefined): string {
  return `${t?.league} - ${t?.country}` || "";
}

function newPlayers(playerName: string[]): Player[] {
  return playerName.map((p) => {
    return {
      name: p,
      stats: {
        gamesPlayed: 0,
        gamesLost: 0,
        gamesTie: 0,
        gamesWon: 0,
        goalsScored: 0,
        goalsAgainst: 0,
        points: 0,
      },
      rank: 1,
      previousRank: 1,
    };
  });
}
