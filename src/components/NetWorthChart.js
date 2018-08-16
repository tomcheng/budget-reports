import React from "react";
import PropTypes from "prop-types";
import includes from "lodash/fp/includes";
import sumBy from "lodash/fp/sumBy";
import { groupBy } from "../optimized";
import {
  primaryColor,
  lightPrimaryColor,
  negativeChartColor
} from "../styleVariables";
import MonthlyChart from "./MonthlyChart";

const CREDIT_ACCOUNTS = ["mortgage", "creditCard"];
const getStack = ({ type, id, mortgageAccounts }) => {
  if (mortgageAccounts[id]) {
    return "liability";
  }

  return includes(type)(CREDIT_ACCOUNTS) ? "liability" : "asset";
};

const NetWorthChart = ({
  data,
  months,
  mortgageAccounts,
  selectedMonth,
  onSelectMonth
}) => {
  const groupedData = groupBy(d =>
    getStack({ type: d.type, id: d.id, mortgageAccounts })
  )(data);
  const monthlyData = months.map((month, index) => ({
    month,
    assets: sumBy(d => d.data[index])(groupedData.asset),
    liabilities: sumBy(d => d.data[index])(groupedData.liability)
  }));

  return (
    <MonthlyChart
      selectedMonth={selectedMonth}
      onSelectMonth={onSelectMonth}
      data={monthlyData}
      height={160}
      series={[
        {
          color: negativeChartColor,
          valueFunction: d => Math.max(-d.liabilities, 0)
        },
        {
          color: lightPrimaryColor,
          valueFunction: d => Math.max(d.assets, 0)
        },
        {
          color: primaryColor,
          type: "line",
          valueFunction: d => d.assets + d.liabilities
        }
      ]}
      stacked={false}
    />
  );
};

NetWorthChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired
    })
  ).isRequired,
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  mortgageAccounts: PropTypes.objectOf(PropTypes.bool).isRequired,
  onSelectMonth: PropTypes.func.isRequired,
  selectedMonth: PropTypes.string
};

export default NetWorthChart;
