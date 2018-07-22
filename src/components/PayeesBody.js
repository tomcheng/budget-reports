import React from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/fp/sumBy";
import { getProcessedPayees } from "../utils";

const PayeesBody = ({ budget }) => {
  const {
    payeesById,
    // sortedByAmount,
    sortedByTransactions
  } = getProcessedPayees(budget);

  return (
    <div>
      {sortedByTransactions.map(id => {
        const payee = payeesById[id];
        const amount = sumBy("amount")(payee.transactions);
        const transactions = payee.transactions.length;

        return (
          <div key={id}>
            {payee.name} {amount} {transactions}
          </div>
        );
      })}
    </div>
  );
};

PayeesBody.propTypes = {
  budget: PropTypes.object.isRequired
};

export default PayeesBody;
