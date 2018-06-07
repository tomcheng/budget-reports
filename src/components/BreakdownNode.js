import React from "react";
import PropTypes from "prop-types";
import ListItem from "./ListItem";
import { SecondaryText } from "./typeComponents";
import AmountWithPercentage from "./AmountWithPercentage";

const BreakdownNode = ({ name, amount, total }) => (
  <ListItem>
    <SecondaryText>{name}</SecondaryText>
    <AmountWithPercentage amount={amount} total={total} />
  </ListItem>
);

BreakdownNode.propTypes = {
  amount: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired
};

export default BreakdownNode;
