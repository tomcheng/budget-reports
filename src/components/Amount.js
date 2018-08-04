import React from "react";
import PropTypes from "prop-types";
import { positiveColor } from "../styleVariables";

const Amount = ({ amount, amountAfterDecimal, style }) => (
  <span style={{ color: amount > 0 && positiveColor, ...style }}>
    {amount > 0 && "+"}
    {Math.abs(amount).toFixed(amountAfterDecimal)}
  </span>
);

Amount.propTypes = {
  amount: PropTypes.number.isRequired,
  amountAfterDecimal: PropTypes.number,
  style: PropTypes.object
};

Amount.defaultProps = {
  amountAfterDecimal: 2
};

export default Amount;
