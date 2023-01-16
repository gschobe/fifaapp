import { Link } from "@mui/material";
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
                <Link
                  fontSize={16}
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    margin: "0 20pt",
                  }}
                  target="_blank"
                  href="https://os5.mycloud.com/action/share/702d870a-ef5c-41fd-bb61-8e2d2dd81cbb"
                >
                  GET EXCEL
                </Link>
                <ImportTeamsAction />
              </div>
            </CardHeader>
            <CardBody>
              <DataGrid
                experimentalFeatures={{ newEditingApi: true }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "OVA", sort: "desc" }],
                  },
                }}
                disableSelectionOnClick
                headerHeight={35}
                autoPageSize
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
