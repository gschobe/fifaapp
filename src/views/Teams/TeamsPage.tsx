import { DataGrid } from "@mui/x-data-grid";
import Card from "components/Card/Card";
import CardBody from "components/Card/CardBody";
import CardHeader from "components/Card/CardHeader";
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import { teamsColumns } from "definitions/TableDefinitions";
import React from "react";
import { storeConnector, StoreProps } from "store/StoreReducer";
import ImportTeamsAction from "views/Overview/actions/ImportTeamsAction";

const TeamsPage: React.FC<StoreProps> = ({ teams }) => {
  return (
    <>
      <GridContainer>
        <GridItem {...{ xs: 12, sm: 12, md: 12 }}>
          <Card className="cardFullScreen">
            <CardHeader color="info">
              <div
                style={{
                  fontSize: "1.2rem",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div>Teams</div>
                <div style={{ flexGrow: 1 }} />
                <ImportTeamsAction />
              </div>
            </CardHeader>
            <CardBody>
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
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </>
  );
};

export default storeConnector(TeamsPage);
