import React from "react";
import PropTypes from "prop-types";
import propEq from "lodash/fp/propEq";
import Transactions from "./Transactions";

const PayeeBody = ({ payee, budget }) => {
  const transactions = budget.transactions.filter(propEq("payeeId", payee.id));
  return (
    <Transactions transactions={transactions} payeesById={budget.payeesById} />
  );
};

PayeeBody.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        payeeId: PropTypes.string.isRequired
      })
    ).isRequired,
    payeesById: PropTypes.object.isRequired
  }).isRequired,
  payee: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

export default PayeeBody;
