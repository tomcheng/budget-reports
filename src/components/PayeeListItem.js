import React from "react";
import PropTypes from "prop-types";
import ListItem from "./ListItem";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

const PayeeListItem = ({ name, amount, total }) => (
  <ListItem>
    <SecondaryText>{name}</SecondaryText>
    <SecondaryText style={{ textAlign: "right" }}>
      <Amount amount={amount} />
      <MinorText style={{ marginTop: -4 }}>
        {Math.round(amount / total * 100)}%
      </MinorText>
    </SecondaryText>
  </ListItem>
);

PayeeListItem.propTypes = {
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired
};

export default PayeeListItem;
