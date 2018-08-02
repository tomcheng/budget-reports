import React from "react";
import PropTypes from "prop-types";
import { getPayeeLink } from "../linkUtils";
import { MinorText, SecondaryText } from "./typeComponents";
import { ListItemLink } from "./ListItem";
import Amount from "./Amount";

const PayeeListItem = ({ name, amount, transactions, id, budgetId }) => (
  <ListItemLink to={getPayeeLink({ budgetId, payeeId: id })}>
    {name}
    <div style={{ textAlign: "right" }}>
      <SecondaryText>
        <Amount amount={amount} />
      </SecondaryText>
      <MinorText style={{ whiteSpace: "nowrap" }}>
        {transactions} transaction{transactions === 1 ? "" : "s"}
      </MinorText>
    </div>
  </ListItemLink>
);

PayeeListItem.propTypes = {
  amount: PropTypes.number.isRequired,
  budgetId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  transactions: PropTypes.number.isRequired
};

export default PayeeListItem;
