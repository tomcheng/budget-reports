import React, { Component } from "react";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height-auto";
import ListItem from "./ListItem";
import { SecondaryText, MinorText } from "./typeComponents";
import Amount from "./Amount";

class BreakdownGroupListItem extends Component {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired
  };

  state = { expanded: false };

  handleToggleExpand = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const { name, amount, total, categories } = this.props;
    const { expanded } = this.state;

    return (
      <ListItem style={{ display: "block", padding: 0 }}>
        <div
          onClick={this.handleToggleExpand}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 0",
            userSelect: "none"
          }}
        >
          <SecondaryText style={{ whiteSpace: "pre" }}>{name}</SecondaryText>
          <SecondaryText
            style={{ textAlign: "right", opacity: expanded ? 0.3 : null }}
          >
            <Amount amount={amount} />
            <MinorText style={{ marginTop: -4 }}>
              {Math.round(amount / total * 100)}%
            </MinorText>
          </SecondaryText>
        </div>
        <AnimateHeight isExpanded={expanded}>
          <div>
            {categories.map(category => (
              <div
                key={category.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0"
                }}
              >
                <SecondaryText>{category.name}</SecondaryText>
                <SecondaryText style={{ textAlign: "right" }}>
                  <Amount amount={category.amount} />
                  <MinorText style={{ marginTop: -4 }}>
                    {Math.round(category.amount / total * 100)}%
                  </MinorText>
                </SecondaryText>
              </div>
            ))}
          </div>
        </AnimateHeight>
      </ListItem>
    );
  }
}

export default BreakdownGroupListItem;
