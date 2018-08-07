import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

class AmountWithPercentage extends PureComponent {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    faded: PropTypes.bool
  };

  render () {
    const { amount, total, faded } = this.props;
    return (
      <SecondaryText style={{ display: "flex", opacity: faded ? 0.3 : 1 }}>
        <Amount amount={amount} />
        <MinorText style={{ width: 42, textAlign: "right", lineHeight: "inherit" }}>
          {total ? `${(amount / total * 100).toFixed(1)}%` : `–`}
        </MinorText>
      </SecondaryText>
    );
  }
}

export default AmountWithPercentage;
