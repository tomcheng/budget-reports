import React from "react";
import PropTypes from "prop-types";
import { MinorText } from "./typeComponents";

const BreakdownPercentage = ({ total, amount }) => (
  <MinorText style={{ width: 36, textAlign: "right" }}>
    {total ? `${Math.round(amount / total * 100)}%` : `–`}
  </MinorText>
);

BreakdownPercentage.propTypes = {
  amount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired
};

export default BreakdownPercentage;
