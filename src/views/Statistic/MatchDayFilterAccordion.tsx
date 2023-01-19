import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import FilterAltRoundedIcon from "@mui/icons-material/FilterAltRounded";
import { DataGrid, GridRowId } from "@mui/x-data-grid";
import { MatchDay } from "definitions/Definitions";
import { matchDayColumns } from "definitions/TableDefinitions";
import {
  FormControl,
  InputLabel,
  Button,
  MenuItem,
  Select,
} from "@material-ui/core";
import { Stack } from "@mui/material";

interface Props {
  matchdays: (MatchDay | undefined)[] | undefined;
  selectionModel: GridRowId[] | undefined;
  setSelectionModel: (newSelectionModel: GridRowId[]) => void;
}

const MatchDayFilterAccordion: React.FC<Props> = ({
  matchdays,
  selectionModel,
  setSelectionModel,
}) => {
  const selectable = React.useMemo(() => {
    const playerstrings = matchdays
      ?.flatMap((md) =>
        md?.players
          .map((p) => p.name)
          .sort()
          .join(", ")
      )
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    return playerstrings?.map((ps, index) => {
      return (
        <MenuItem key={index} value={ps}>
          {ps}
        </MenuItem>
      );
    });
  }, [matchdays]);

  const [selected, setSelected] = React.useState<string>();

  const handleChange = (event: any) => {
    const sel = event.target.value;
    setSelected(sel);

    if (matchdays) {
      console.log(sel);
      setSelectionModel(
        matchdays
          ?.filter(
            (md) =>
              md?.players
                .map((p) => p.name)
                .sort()
                .join(", ") === sel
          )
          .map((md) => md?.id || "0")
      );
    }
  };

  const onClear = () => {
    setSelected("");

    if (matchdays) {
      setSelectionModel(matchdays.map((md) => md?.id || ""));
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<FilterAltRoundedIcon />}>
        <Typography style={{ width: "33%", flexShrink: 0 }}>
          Matchday Filter / Settings
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          {`${selectionModel?.length} of ${matchdays?.length} matchdays selected`}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction={"row"} width="80%" marginBottom={"10pt"}>
          <FormControl style={{ width: "70%" }}>
            <InputLabel style={{ paddingLeft: "5px" }}>
              Select matchday players
            </InputLabel>
            <Select
              //   style={{ width: "60%" }}
              value={selected ? selected : ""}
              onChange={handleChange}
            >
              {selectable}
            </Select>
          </FormControl>
          {selected && (
            <Button
              style={{ padding: "0", textAlign: "end" }}
              disabled={!selected}
              onClick={onClear}
            >
              Clear
            </Button>
          )}
        </Stack>
        {matchdays && (
          <DataGrid
            hideFooter
            checkboxSelection
            autoHeight
            initialState={{
              sorting: {
                sortModel: [{ field: "id", sort: "desc" }],
              },
            }}
            selectionModel={selectionModel}
            onSelectionModelChange={(newSelectionModel) => {
              setSelectionModel(newSelectionModel);
            }}
            headerHeight={35}
            rowHeight={30}
            rows={matchdays}
            columns={matchDayColumns(true)}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default MatchDayFilterAccordion;
