import React, { Component } from "react";
import PropTypes from "prop-types";
import AnimateHeight from "react-animate-height-auto";
import ListItem from "./ListItem";
import AmountWithPercentage from "./AmountWithPercentage";
import BreakdownCategoryListItem from "./BreakdownCategoryListItem";
import NameWithExpandedIndicator from "./NameWithExpandedIndicator";

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
          <NameWithExpandedIndicator name={name} expanded={expanded} />
          <AmountWithPercentage
            amount={amount}
            total={total}
            faded={expanded}
          />
        </div>
        <AnimateHeight isExpanded={expanded}>
          <div style={{ paddingLeft: 18 }}>
            {categories.map(category => (
              <BreakdownCategoryListItem
                key={category.id}
                category={category}
                total={total}
              />
            ))}
          </div>
        </AnimateHeight>
      </ListItem>
    );
  }
}

export default BreakdownGroupListItem;
