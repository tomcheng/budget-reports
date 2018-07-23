import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { getProcessedPayees } from "../utils";
import PayeeListItem from "./PayeeListItem";

class PayeesBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired
  };

  render() {
    const { budget, sort } = this.props;

    return getProcessedPayees({ budget, sort }).map(payee => (
      <PayeeListItem
        key={payee.id}
        id={payee.id}
        name={payee.name}
        amount={payee.amount}
        transactions={payee.transactions}
        budgetId={budget.id}
      />
    ));
  }
}

export default PayeesBody;
