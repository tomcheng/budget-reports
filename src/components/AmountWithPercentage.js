import React from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

const AmountWithPercentage = ({
  amount,
  positiveIsRed,
  total,
  faded,
  selected
}) => (
  <SecondaryText
    style={{
      display: "flex",
      alignItems: "baseline",
      opacity: faded ? 0.3 : 1,
      fontWeight: selected && 700
    }}
  >
    <Amount amount={amount} positiveIsRed={positiveIsRed} />
    <MinorText
      style={{ width: 44, textAlign: "right", fontWeight: selected && 700 }}
    >
      {total ? `${((amount / total) * 100).toFixed(1)}%` : `–`}
    </MinorText>
  </SecondaryText>
);

AmountWithPercentage.propTypes = {
  amount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  positiveIsRed: PropTypes.bool,
  faded: PropTypes.bool,
  selected: PropTypes.bool
};

export default AmountWithPercentage;
