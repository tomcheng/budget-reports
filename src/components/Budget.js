import React, { Component } from "react";
import PropTypes from "prop-types";
import CategoryGroup from "./CategoryGroup";

const GROUPS_TO_HIDE = [
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories"
];

class Budget extends Component {
  static propTypes = {
    budget: PropTypes.shape({
      categoryGroups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired
        })
      ).isRequired,
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          categoryGroupId: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired,
    currentUrl: PropTypes.string.isRequired
  };

  state = {
    expandedGroups: {}
  };

  handleToggleGroup = id => {
    this.setState(state => ({
      ...state,
      expandedGroups: {
        ...state.expandedGroups,
        [id]: !state.expandedGroups[id]
      }
    }));
  };

  render() {
    const { budget, currentUrl } = this.props;
    const { expandedGroups } = this.state;

    return budget.categoryGroups
      .filter(g => !GROUPS_TO_HIDE.includes(g.name))
      .map(categoryGroup => (
        <CategoryGroup
          key={categoryGroup.id}
          categoryGroup={categoryGroup}
          categories={budget.categories.filter(
            c => c.categoryGroupId === categoryGroup.id
          )}
          currentUrl={currentUrl}
          expanded={!!expandedGroups[categoryGroup.id]}
          onToggleGroup={this.handleToggleGroup}
        />
      ));
  }
}

export default Budget;
