import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { getProcessedPayees } from "../utils";
import PayeeListItem from "./PayeeListItem";
import Section from "./Section";

class PayeesBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired
  };

  render() {
    const { budget, sort } = this.props;
    return (
      <Section noPadding>
        {getProcessedPayees({ budget, sort }).map(payee => (
          <PayeeListItem
            key={payee.id}
            id={payee.id}
            name={payee.name}
            amount={payee.amount}
            transactions={payee.transactionCount}
            budgetId={budget.id}
          />
        ))}
      </Section>
    );
  }
}

export default PayeesBody;
