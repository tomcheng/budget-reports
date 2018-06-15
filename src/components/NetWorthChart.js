import React from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import Chart from "./Chart";

const NetWorthChart = ({ series, categories }) => (
  <Section>
    <Chart
      options={{
        chart: {
          type: "column",
          height: 220
        },
        yAxis: { title: { text: null } },
        xAxis: {
          categories
        },
        plotOptions: {
          column: { stacking: "normal" }
        },
        series: series.map(s => ({
          ...s,
          data: (s.stack === "liability" ? s.data.map(n => -n) : s.data).map(
            n => Math.max(n, 0)
          )
        }))
      }}
    />
  </Section>
);

NetWorthChart.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      name: PropTypes.string.isRequired,
      stack: PropTypes.oneOf(["asset", "liability"]).isRequired
    })
  ).isRequired
};

export default NetWorthChart;
