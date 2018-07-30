import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import CurrentMonthSpending from "./CurrentMonthSpending";
import RecentTransactions from "./RecentTransactions";

const DashboardBody = ({ budget, currentMonth, investmentAccounts }) => (
  <Fragment>
    <Section title="Current Month Spending">
      <CurrentMonthSpending
        budget={budget}
        currentMonth={currentMonth}
        investmentAccounts={investmentAccounts}
      />
    </Section>
    <Section title="Transactions in the Past 7 Days">
      <RecentTransactions budget={budget} />
    </Section>
  </Fragment>
);

DashboardBody.propTypes = {
  budget: PropTypes.object.isRequired,
  currentMonth: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired
};

export default DashboardBody;
