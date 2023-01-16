import React from "react";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import { IconButton } from "@mui/material";
import { matchDayConnector, MatchDayStoreProps } from "store/FifaGamesReducer";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { downLoadMatchDayData } from "utils/FileUtils";

type Kind = "export" | "import" | undefined;

const ExportMatchdayDataAction: React.FC<MatchDayStoreProps> = ({
  matchDays,
  addMatchDays,
}) => {
  const [kind, setKind] = React.useState<Kind>();
  const [file, setFile] = React.useState<File>();
  const [exportDataOpen, setExportDataOpen] = React.useState(false);

  const handleToggle: (kind: Kind) => void = (kind) => {
    setKind(kind);
    setExportDataOpen((exportDataOpen) => !exportDataOpen);
  };
  const handleExport = () => {
    if (kind === "export") {
      downLoadMatchDayData(
        Object.values(matchDays).filter((md) => md?.state !== "DELETED")
      );
    } else if (kind === "import" && file) {
      getUploadedMatchdayData(file);
    }
    handleToggle(undefined);
  };

  const getUploadedMatchdayData: (file: File) => void = (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const content = fileReader.result;
      if (typeof content === "string") {
        addMatchDays(JSON.parse(content));
      }
    };
    fileReader.readAsText(file);
  };

  const handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void = async (e) => {
    if (e.target.files !== null) {
      const file = e.target.files[0];
      setFile(file);
    }
  };
  return (
    <>
      <IconButton
        color="primary"
        aria-label="matchday import"
        style={{ color: "white", padding: "0 5pt" }}
        onClick={() => {
          handleToggle("import");
        }}
      >
        <FileUploadRoundedIcon />
      </IconButton>
      <IconButton
        color="primary"
        style={{ color: "white", padding: "0 5pt" }}
        onClick={() => handleToggle("export")}
      >
        <FileDownloadRoundedIcon />
      </IconButton>
      <Dialog open={exportDataOpen} onClose={() => handleToggle(undefined)}>
        <DialogTitle>
          {kind === "import"
            ? "Upload Matchday data from file"
            : "Download Data to file"}
        </DialogTitle>
        {/* <DialogContentText style={{ padding: "20px", fontWeight: "bold" }}>
          Either load default teams or import teams from file.
        </DialogContentText> */}
        <DialogContent>
          <Box display="flex" flexDirection="column">
            {kind === "import" && (
              <input
                type={"file"}
                onChange={handleFileChange}
                accept=".json"
                //   disabled={importDefaultTeams}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleToggle(undefined)}>Cancel</Button>
          <Button
            onClick={handleExport}
            disabled={kind === "import" && file === undefined}
          >
            {kind === "import" ? "Upload" : "Download"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default matchDayConnector(ExportMatchdayDataAction);
