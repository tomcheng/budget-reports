import React from "react";
import PropTypes from "prop-types";
import TopNumbers from "../common/TopNumbers";

const IncomeVsExpensesSummaryForSingleMonth = ({ income, expenses }) => (
  <TopNumbers
    numbers={[
      {
        label: "income",
        value: income
      },
      {
        label: "expenses",
        value: -expenses
      },
      {
        label: "net income",
        value: income + expenses
      }
    ]}
    roundToDollar
  />
);

IncomeVsExpensesSummaryForSingleMonth.propTypes = {
  expenses: PropTypes.number.isRequired,
  income: PropTypes.number.isRequired
};

export default IncomeVsExpensesSummaryForSingleMonth;
