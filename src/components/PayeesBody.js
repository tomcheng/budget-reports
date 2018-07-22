import React from "react";
import PropTypes from "prop-types";
import { getProcessedPayees } from "../utils";
import PayeeListItem from "./PayeeListItem";

const PayeesBody = ({ budget, sort }) =>
  getProcessedPayees({ budget, sort }).map(payee => (
    <PayeeListItem
      key={payee.id}
      id={payee.id}
      name={payee.name}
      amount={payee.amount}
      transactions={payee.transactions}
      budgetId={budget.id}
    />
  ));

PayeesBody.propTypes = {
  budget: PropTypes.object.isRequired,
  sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired
};

export default PayeesBody;
