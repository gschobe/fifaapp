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
import { MatchDay, Tournament, TournamentMode } from "definitions/Definitions";
import DialogContentText from "@mui/material/DialogContentText";
import { Button } from "@mui/material";
import TournamentSettings from "./CreateComponents/TournamentSettings";
import MatchDaySettings from "./CreateComponents/MatchDaySettings";

const useStyles = makeStyles(styles);

const CreateMatchDayAction: React.FC<StoreProps & MatchDayStoreProps> = ({
  player,
  addMatchDay,
  matchDays,
  teams,
}) => {
  const players = React.useMemo(() => {
    return Object.values(player);
  }, [player]);

  const classes = useStyles();
  const [playerName, setPlayerName] = React.useState<string[]>([]);
  const [ratings, setRatings] = React.useState<string[]>([]);
  const [includeSecondRound, setIncludeSecondRound] = React.useState(false);

  const [newTournamentOpen, setNewTournamentOpen] = React.useState(false);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNewTournamenClick: () => void = () => {
    setNewTournamentOpen((newTournamentOpen) => !newTournamentOpen);
  };

  const handleIncludeSecondRoundChanged: (event: any) => void = (event) => {
    setIncludeSecondRound(event.target.checked);
  };

  const steps = [
    "Select matchday settings",
    "Select Teams",
    "Create tournament",
  ];

  const [mode, setMode] = React.useState<TournamentMode>();
  const handleChange = (event: any) => {
    setMode(event.target.value);
  };

  const handleSelectionChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    setPlayerName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleRatingSelectionChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    setRatings(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      const matchdayPlayers = playerName.map((p) => {
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
        };
      });

      const usabeleTeams = [
        ...teams.filter((team) => ratings.includes(team.rating)),
      ];
      const tournament: Tournament = {
        id: "1",
        tournamentTeams: [],
        games: [],
        state: "NEW",
        withSecondRound: includeSecondRound,
        useableTeams: usabeleTeams,
      };

      const id = Object.keys(matchDays).length + 1;
      const matchday: MatchDay = {
        id: id.toString(),
        startDate: new Date(),
        players: matchdayPlayers,
        mode: mode || "2on2",
        usedTeams: [],
        tournaments: [tournament],
        state: "NEW",
      };
      addMatchDay(matchday);
      setActiveStep(0);
      setIncludeSecondRound(false);
      setMode(undefined);
      setPlayerName([]);
      setRatings([]);
      setNewTournamentOpen(false);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <>
      <Dialog
        fullWidth
        open={newTournamentOpen}
        onClose={handleNewTournamenClick}
      >
        <DialogTitle>Create new matchday</DialogTitle>
        <DialogContentText style={{ paddingLeft: "20px" }}>
          Define your matchday and inital tournament settings.
        </DialogContentText>
        <DialogContent>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === 0 && (
            <MatchDaySettings
              playerName={playerName}
              handleSelectionChange={handleSelectionChange}
              handleModeChange={handleChange}
              mode={mode}
              players={players}
            />
          )}
          {activeStep === 1 && (
            <TournamentSettings
              ratings={ratings}
              handleRatingSelectionChange={handleRatingSelectionChange}
              handleIncludeChanged={handleIncludeSecondRoundChanged}
              includeSecondRound={includeSecondRound}
            />
          )}
          <Box
            style={{ display: "flex", flexDirection: "row", paddingTop: 10 }}
          >
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box style={{ flex: "1 1 auto" }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Create" : "Next"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      <IconButton
        color="primary"
        aria-label="add player"
        className={classes.cardTitleWhite}
        onClick={handleNewTournamenClick}
      >
        <AddBoxOutlined />
      </IconButton>
    </>
  );
};

export default storeConnector(matchDayConnector(CreateMatchDayAction));
