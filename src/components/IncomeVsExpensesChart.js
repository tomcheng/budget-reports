import React from "react";
import PropTypes from "prop-types";
import {
  primaryColor,
  lightPrimaryColor,
  negativeChartColor
} from "../styleVariables";
import MonthlyChart from "./MonthlyChart";

const IncomeVsExpensesChart = ({ data, onSelectMonth, selectedMonth }) => (
  <MonthlyChart
    data={data}
    height={180}
    selectedMonth={selectedMonth}
    series={[
      { color: lightPrimaryColor, valueFunction: d => d.income },
      { color: negativeChartColor, valueFunction: d => d.expenses },
      {
        type: "line",
        color: primaryColor,
        valueFunction: d => d.income + d.expenses
      }
    ]}
    onSelectMonth={onSelectMonth}
  />
);

IncomeVsExpensesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      expenses: PropTypes.number.isRequired,
      income: PropTypes.number.isRequired,
      month: PropTypes.string.isRequired
    })
  ).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default IncomeVsExpensesChart;
