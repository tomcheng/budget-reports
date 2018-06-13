import React from "react";
// import PropTypes from "prop-types";
import Chart from "./Chart";

const NetWorthChart = ({ series, categories }) => (
  <Chart
    options={{
      chart: {
        type: "column",
        height: 400
      },
      legend: { enabled: true },
      yAxis: { title: { text: null } },
      xAxis: {
        categories
      },
      plotOptions: {
        column: { stacking: "normal" }
      },
      series: series.map(s => ({
        ...s,
        data: (s.stack === "liability" ? s.data.map(n => -n) : s.data).map(n =>
          Math.max(n, 0)
        )
      }))
    }}
  />
);

NetWorthChart.propTypes = {};

export default NetWorthChart;
