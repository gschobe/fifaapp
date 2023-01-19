import React, { ReactNode } from "react";
import Card from "components/Card/Card";
import CardFooter from "components/Card/CardFooter";
import CardHeader from "components/Card/CardHeader";
import CardIcon from "components/Card/CardIcon";
import GridItem from "components/Grid/GridItem";

interface Props {
  value: string | number | undefined;
  text: string | ReactNode | undefined;
  withLabel?: boolean;
  kpiLabel: string;
  color: string;
  lg?: number;
  md?: number;
}

const Kpi: React.FC<Props> = ({
  value,
  text,
  kpiLabel,
  color,
  withLabel = true,
  md = 3,
  lg = 3,
}) => {
  return (
    <GridItem {...{ xs: 12, sm: 6, md: md, lg: lg }}>
      <Card className="cardKpi">
        <CardHeader color={color} stats icon>
          <CardIcon color={color}>
            <h3>{value}</h3>
          </CardIcon>
          <div
            style={{
              paddingLeft: "30%",
              textAlign: "center",
              color: "grey",
              fontSize: 20,
              marginTop: "10pt",
              //   fontWeight: "bold",
            }}
          >
            {text}
          </div>
        </CardHeader>
        <CardFooter stats={withLabel ? true : false}>
          {withLabel && (
            <div
              style={{
                color: "grey",
                display: "inline-flex",
                fontSize: "16px",
                fontWeight: "bold",
                lineHeight: "22px",
              }}
            >
              {kpiLabel}
            </div>
          )}
        </CardFooter>
      </Card>
    </GridItem>
  );
};

export default Kpi;
