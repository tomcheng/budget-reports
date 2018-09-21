import React from "react";
import PropTypes from "prop-types";
import { positiveColor } from "../styleVariables";
import CurrencyContext from "./CurrencyContext";

export const addCommas = nStr => {
  nStr += "";

  const x = nStr.split(".");
  let x1 = x[0];
  const x2 = x.length > 1 ? "." + x[1] : "";
  const rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1,$2");
  }
  return x1 + x2;
};

const Amount = ({ amount, amountAfterDecimal, showCurrencySymbol, style }) => (
  <CurrencyContext.Consumer>
    {currencyFormat => (
      <span style={{ color: amount > 0 && positiveColor, ...style }}>
        {amount > 0 && "+"}
        {showCurrencySymbol && currencyFormat.symbol}
        {addCommas(Math.abs(amount).toFixed(amountAfterDecimal))}
      </span>
    )}
  </CurrencyContext.Consumer>
);

Amount.propTypes = {
  amount: PropTypes.number.isRequired,
  amountAfterDecimal: PropTypes.number,
  showCurrencySymbol: PropTypes.bool,
  style: PropTypes.object
};

Amount.defaultProps = {
  amountAfterDecimal: 2
};

export default Amount;
