import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import pages, { makeLink } from "../pages";
import { MinorText, SecondaryText } from "./typeComponents";
import { LargeListItemLink } from "./ListItem";
import Amount from "./Amount";

class PayeeListItem extends PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    budgetId: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    transactions: PropTypes.number.isRequired
  };

  render() {
    const { name, amount, transactions, id, budgetId } = this.props;

    return (
      <LargeListItemLink to={makeLink(pages.payee.path, { budgetId, payeeId: id })}>
        {name}
        <div style={{ textAlign: "right" }}>
          <SecondaryText>
            <Amount amount={amount} />
          </SecondaryText>
          <MinorText style={{ whiteSpace: "nowrap" }}>
            {transactions} transaction{transactions === 1 ? "" : "s"}
          </MinorText>
        </div>
      </LargeListItemLink>
    );
  }
}

export default PayeeListItem;
