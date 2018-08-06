import React from "react";
import PropTypes from "prop-types";
import pages, { makeLink } from "../pages";
import { MinorText, SecondaryText } from "./typeComponents";
import { LargeListItemLink } from "./ListItem";
import Amount from "./Amount";

const PayeeListItem = ({ name, amount, transactions, id, budgetId }) => (
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

PayeeListItem.propTypes = {
  amount: PropTypes.number.isRequired,
  budgetId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  transactions: PropTypes.number.isRequired
};

export default PayeeListItem;
