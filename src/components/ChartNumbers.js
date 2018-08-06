import React from "react";
import PropTypes from "prop-types";
import { MinorText, LargeNumber } from "./typeComponents";
import Amount from "./Amount";

const ChartNumbers = ({ numbers }) => (
  <div
    style={{
      textAlign: "right",
      lineHeight: "16px",
      display: "flex",
      justifyContent: "flex-start",
      flexDirection: "row-reverse",
      marginBottom: 8
    }}
  >
    {numbers.map(({ amount, label }) => (
      <div style={{ marginLeft: 20 }}>
        <LargeNumber style={{ lineHeight: "16px" }}>
          <Amount amount={amount} />
        </LargeNumber>
        <MinorText>{label}</MinorText>
      </div>
    ))}
  </div>);

ChartNumbers.propTypes = {
  numbers: PropTypes.arrayOf(PropTypes.shape({
    amount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default ChartNumbers;
