import React from "react";
import PropTypes from "prop-types";
import TopNumbers from "../common/TopNumbers";

const IncomeVsExpensesSummaryForMultipleMonths = ({
  averageExpenses,
  averageIncome
}) => (
  <TopNumbers
    numbers={[
      {
        label: "avg. income",
        value: averageIncome
      },
      {
        label: "avg. expenses",
        value: -averageExpenses
      },
      {
        label: "avg. net income",
        value: averageIncome + averageExpenses
      }
    ]}
    roundToDollar
  />
);

IncomeVsExpensesSummaryForMultipleMonths.propTypes = {
  averageExpenses: PropTypes.number.isRequired,
  averageIncome: PropTypes.number.isRequired
};

export default IncomeVsExpensesSummaryForMultipleMonths;
