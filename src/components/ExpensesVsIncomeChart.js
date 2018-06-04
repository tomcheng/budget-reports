import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import findIndex from "lodash/findIndex";
import property from "lodash/property";
import { plotBandColor } from "../styleVariables";
import Chart from "./Chart";

const ExpensesVsIncomeChart = ({ data, excludedMonths }) => {
  const plotBands = excludedMonths.map(month => {
    const index = findIndex(data, d => d.month === month);
    return { color: plotBandColor, from: index - 0.5, to: index + 0.5 };
  });
  return (
    <Chart
      options={{
        chart: { type: "column" },
        xAxis: {
          categories: data.map(d => moment(d.month).format("MMM YY")),
          plotBands
        },
        yAxis: {
          title: {
            text: null
          }
        },
        plotOptions: {
          series: {
            stacking: "normal"
          }
        },
        series: [
          {
            name: "Income",
            data: data.map(property("income")),
            enableMouseTracking: false,
          },
          {
            name: "Expenses",
            data: data.map(property("expenses")),
            enableMouseTracking: false,
          },
          {
            type: "line",
            name: "Net Income",
            data: data.map(d => d.income + d.expenses),
            enableMouseTracking: false,
          }
        ]
      }}
    />
  );
};

ExpensesVsIncomeChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      expenses: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
      month: PropTypes.string.isRequired
    })
  ).isRequired,
  excludedMonths: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ExpensesVsIncomeChart;
