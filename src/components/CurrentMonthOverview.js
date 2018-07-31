import React from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import SpendingChart from "./SpendingChart";

const CurrentMonthOverview = ({ transactions, budgetId, currentMonth }) => (
  <Section title="Day By Day">
    <SpendingChart
      transactions={transactions}
      budgetId={budgetId}
      currentMonth={currentMonth}
    />
  </Section>
);

CurrentMonthOverview.propTypes = {
  budgetId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  transactions: PropTypes.array.isRequired
};

export default CurrentMonthOverview;
