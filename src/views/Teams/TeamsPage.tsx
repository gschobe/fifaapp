import { Box } from "@material-ui/core";
import { DataGrid } from "@mui/x-data-grid";
import { teamsColumns } from "definitions/TableDefinitions";
import React from "react";
import { storeConnector, StoreProps } from "store/StoreReducer";

const TeamsPage: React.FC<StoreProps> = ({ teams }) => {
  return (
    <>
      <Box height="95vh" marginTop="10px">
        <DataGrid
          experimentalFeatures={{ newEditingApi: true }}
          disableSelectionOnClick
          headerHeight={35}
          autoPageSize
          //   editMode="row"
          rowHeight={30}
          getRowId={(row) => row.name}
          rows={Object.values(teams)}
          columns={teamsColumns(true)}
        />
      </Box>
    </>
  );
};

export default storeConnector(TeamsPage);
