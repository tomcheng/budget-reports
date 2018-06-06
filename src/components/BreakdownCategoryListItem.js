import React, { Component } from "react";
import PropTypes from "prop-types";
import { SecondaryText } from "./typeComponents";
import AmountWithPercentage from "./AmountWithPercentage";

class BreakdownCategoryListItem extends Component {
  static propTypes = {
    category: PropTypes.shape({
      name: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired
    }).isRequired,
    total: PropTypes.number.isRequired
  };

  render() {
    const { category, total } = this.props;

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0"
        }}
      >
        <SecondaryText>{category.name}</SecondaryText>
        <AmountWithPercentage amount={category.amount} total={total} />
      </div>
    );
  }
}

export default BreakdownCategoryListItem;
