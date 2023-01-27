import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Line } from "react-chartjs-2";
import GridItem from "components/Grid/GridItem";
import { ChartStatistics } from "./StatsUtil";
import { MenuItem, Select } from "@material-ui/core";
import CardHeader from "components/Card/CardHeader";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

interface Props {
  stats: ChartStatistics | undefined;
  lg?: number;
  md?: number;
}
const Chart: React.FC<Props> = ({ stats, md = 6, lg = 6 }) => {
  const chartOptions = React.useMemo(() => {
    return stats?.stats.map((s) => s.id);
  }, [stats]);
  const [chart, setChart] = React.useState(chartOptions ? chartOptions[0] : "");
  React.useEffect(() => {
    setChart(chartOptions ? chartOptions[0] : "");
  }, [chartOptions]);
  const handleChartChange: (event: any) => void = (event) => {
    const {
      target: { value },
    } = event;
    setChart(value);
  };

  const dataSets = React.useMemo(() => {
    const series = stats?.stats.find((s) => s.id === chart);
    if (!series) {
      return [];
    }

    return series.series.map((ps) => ({ label: ps.name, data: ps.values }));
  }, [stats, chart]);

  return (
    <GridItem {...{ xs: 12, sm: 12, md: md, lg: lg }}>
      <Card
        style={{
          padding: "0",
          marginTop: "20px",
          borderRadius: "6px",
          boxShadow: "0 1px 4px 0 rgba(#000000, 0.14)",
          color: "rgba(#000000, 0.87)",
        }}
      >
        <CardHeader>
          <Select
            fullWidth
            value={chart}
            onChange={handleChartChange}
            style={{ textAlign: "center" }}
          >
            {chartOptions?.map((c) => {
              return (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              );
            })}
          </Select>
        </CardHeader>
        <CardContent style={{ maxHeight: "40vh", padding: "0 0 10px 15px" }}>
          <Line
            data={{ labels: stats?.started, datasets: dataSets }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
              events: ["click"],
            }}
          />
        </CardContent>
      </Card>
    </GridItem>
  );
};

export default Chart;
