import React from "react";
import PropTypes from "prop-types";
import property from "lodash/property";
import Chart from "./Chart";

const ExpensesVsIncomeChart = ({ data }) => (
  <Chart
    options={{
      chart: {
        type: "column"
      },
      xAxis: [{ categories: data.map(property("month")) }],
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
          data: data.map(property("income"))
        },
        {
          name: "Expenses",
          data: data.map(property("expenses"))
        },
        {
          type: "line",
          name: "Net Income",
          data: data.map(d => d.income + d.expenses)
        }
      ]
    }}
  />
);

ExpensesVsIncomeChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      expense: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
      month: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ExpensesVsIncomeChart;
