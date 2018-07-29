import React from "react";
import PropTypes from "prop-types";
import Section from "./Section";
import RecentTransactions from "./RecentTransactions";

const DashboardBody = ({ budget }) => (
  <Section title="Transactions in the past 7 days">
    <RecentTransactions budget={budget} />
  </Section>
);

DashboardBody.propTypes = { budget: PropTypes.object.isRequired };

export default DashboardBody;
