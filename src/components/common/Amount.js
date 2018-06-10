import React from "react";
import PropTypes from "prop-types";
import { positiveColor } from "../../styleVariables";

const Amount = ({ amount, amountAfterDecimal }) => (
  <span style={{ color: amount > 0 && positiveColor }}>
    {amount > 0 && "+"}{Math.abs(amount).toFixed(amountAfterDecimal)}
  </span>
);

Amount.propTypes = {
  amount: PropTypes.number.isRequired,
  amountAfterDecimal: PropTypes.number
};

Amount.defaultProps = {
  amountAfterDecimal: 2
};

export default Amount;
