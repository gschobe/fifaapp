import React from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { storeConnector, StoreProps } from "store/StoreReducer";
import * as XSLX from "xlsx";
import { Team, TeamImport } from "definitions/Definitions";
import CloudUploadOutlined from "@material-ui/icons/CloudUploadOutlined";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/system";
import { defaultTeams } from "assets/defaultTeams";

const useStyles = makeStyles(styles);

const ImportTeamsAction: React.FC<StoreProps> = ({ setTeams }) => {
  const classes = useStyles();
  const [importTeamsOpen, setImportTeamsOpen] = React.useState(false);
  const handleClickImport: () => void = () => {
    setImportTeamsOpen((importTeamsOpen) => !importTeamsOpen);
  };

  const [importDefaultTeams, setImportDefault] = React.useState(false);

  const [defaultFileContent, setDefaultFileContent] = React.useState<Team[]>(
    []
  );
  const handleImportFileChanged: (event: any) => void = (event) => {
    if (event.target.checked && defaultFileContent.length === 0) {
      const teams = defaultTeams.map((team) => {
        return {
          name: team.Team,
          country: team.Country,
          league: team.League,
          rating: team.Rating,
          OVA: team.OVA,
          ATT: team.ATT,
          MID: team.MID,
          DEF: team.DEF,
        };
      });
      setDefaultFileContent(teams);
    }
    setImportDefault((importDefaultTeams) => !importDefaultTeams);
  };

  const handleTeamImportSave: () => void = () => {
    setTeams(importDefaultTeams ? defaultFileContent : fileContent);
    setFileContent([]);
    setImportTeamsOpen(false);
  };

  const [fileContent, setFileContent] = React.useState<Team[]>([]);
  const handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void = async (e) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];

      const data = await file.arrayBuffer();
      const workbook = XSLX.read(data);

      const workSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: TeamImport[] = XSLX.utils.sheet_to_json(workSheet);

      const teams = jsonData.map((team) => {
        return {
          name: team.Team,
          country: team.Country,
          league: team.League,
          rating: team.Rating,
          OVA: team.OVA,
          ATT: team.ATT,
          MID: team.MID,
          DEF: team.DEF,
        };
      });
      setFileContent(teams);
    }
  };

  return (
    <>
      <IconButton
        color="primary"
        aria-label="import Teams"
        className={classes.cardTitleWhite}
        onClick={handleClickImport}
        style={{ padding: "0", color: "white" }}
      >
        <CloudUploadOutlined />
      </IconButton>
      <Dialog open={importTeamsOpen} onClose={handleClickImport}>
        <DialogTitle>Import Teams</DialogTitle>
        <DialogContentText style={{ padding: "20px", fontWeight: "bold" }}>
          Either load default teams or import teams from file.
        </DialogContentText>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <input
              type={"file"}
              onChange={handleFileChange}
              disabled={importDefaultTeams}
            />
            <FormControlLabel
              style={{ marginTop: "10px" }}
              control={
                <Checkbox
                  color="primary"
                  checked={importDefaultTeams}
                  onChange={handleImportFileChanged}
                />
              }
              label="Import default teams"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickImport}>Cancel</Button>
          <Button onClick={handleTeamImportSave}>Import</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default storeConnector(ImportTeamsAction);

// function convertRating(Rating: any): TeamRating {
//   switch (Rating) {
//     case 5:
//       return "5 stars";
//     case 4.5:
//       return "4.5 stars";
//     case 4:
//       return "4 stars";
//     case 3.5:
//       return "3.5 stars";
//     default:
//       return "3 stars";
//   }
// }
