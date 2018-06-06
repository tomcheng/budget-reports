import React from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

const AmountWithPercentage = ({ amount, total, faded }) => (
  <SecondaryText style={{ display: "flex", opacity: faded ? 0.3 : 1 }}>
    <Amount amount={amount} />
    <MinorText style={{ width: 36, textAlign: "right" }}>
      {Math.round(amount / total * 100)}%
    </MinorText>
  </SecondaryText>
);

AmountWithPercentage.propTypes = {
  amount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  faded: PropTypes.bool
};

AmountWithPercentage.defaultProps = { faded: false };

export default AmountWithPercentage;
