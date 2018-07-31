import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import get from "lodash/fp/get";
import Section from "./Section";
import GroupedTransactions from "./GroupedTransactions";

const CurrentMonthTransactions = ({ budget, transactions }) => (
  <Section title="Transactions">
    <GroupedTransactions
      transactions={transactions}
      groupBy="date"
      groupDisplayFunction={day => moment(day).format("dddd, MMMM D")}
      leafDisplayFunction={transaction =>
        get(["payeesById", transaction.payeeId, "name"])(budget)
      }
    />
  </Section>
);

CurrentMonthTransactions.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        payeeId: PropTypes.string
      })
    ).isRequired,
    payeesById: PropTypes.objectOf(
      PropTypes.shape({ name: PropTypes.string.isRequired })
    ).isRequired
  }).isRequired,
  transactions: PropTypes.array.isRequired
};

export default CurrentMonthTransactions;
