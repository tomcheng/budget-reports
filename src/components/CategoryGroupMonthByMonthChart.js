import React from "react";
import PropTypes from "prop-types";
import Chart from "./Chart";

const CategoryGroupMonthByMonthChart = () => (
  <Chart
    options={{ chart: { type: "column" }, series: [{ data: [1, 2, 3] }] }}
  />
);

CategoryGroupMonthByMonthChart.propTypes = {};

export default CategoryGroupMonthByMonthChart;
