import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

class AmountWithPercentage extends PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    faded: PropTypes.bool,
    selected: PropTypes.bool
  };

  render() {
    const { amount, total, faded, selected } = this.props;
    return (
      <SecondaryText
        style={{
          display: "flex",
          justifyContent: "flex-end",
          flexGrow: 1,
          alignItems: "baseline",
          opacity: faded ? 0.3 : 1,
          fontWeight: selected && 700
        }}
      >
        <Amount amount={amount} />
        <MinorText
          style={{ width: 44, textAlign: "right", fontWeight: selected && 700 }}
        >
          {total ? `${((amount / total) * 100).toFixed(1)}%` : `–`}
        </MinorText>
      </SecondaryText>
    );
  }
}

export default AmountWithPercentage;
