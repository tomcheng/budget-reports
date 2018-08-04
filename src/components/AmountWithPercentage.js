import React from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

const AmountWithPercentage = ({ amount, total, faded }) => (
  <SecondaryText style={{ display: "flex", opacity: faded ? 0.3 : 1 }}>
    <Amount amount={amount} />
    <MinorText style={{ width: 42, textAlign: "right" }}>
      {total ? `${(amount / total * 100).toFixed(1)}%` : `–`}
    </MinorText>
  </SecondaryText>
);

AmountWithPercentage.propTypes = {
  amount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  faded: PropTypes.bool
};

export default AmountWithPercentage;
