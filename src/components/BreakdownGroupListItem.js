import React, { Component } from "react";
import PropTypes from "prop-types";
import ListItem from "./ListItem";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

class BreakdownGroupListItem extends Component {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired
  };

  render() {
    const { name, amount, total } = this.props;

    return (
      <ListItem>
        <SecondaryText style={{ whiteSpace: "pre" }}>{name}</SecondaryText>
        <SecondaryText style={{ textAlign: "right" }}>
          <Amount amount={amount} />
          <MinorText style={{ marginTop: -4 }}>
            {Math.round(amount / total * 100)}%
          </MinorText>
        </SecondaryText>
      </ListItem>
    );
  }
}

export default BreakdownGroupListItem;
