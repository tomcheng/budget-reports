import React, { Component } from "react";
import PropTypes from "prop-types";
import { getExpandedGroups, setExpandedGroups } from "../uiRepo";
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
      ).isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    currentUrl: PropTypes.string.isRequired
  };

  constructor(props) {
    super();
    this.state = { expandedGroups: getExpandedGroups(props.budget.id) };
  }

  handleToggleGroup = id => {
    this.setState(
      state => ({
        ...state,
        expandedGroups: {
          ...state.expandedGroups,
          [id]: !state.expandedGroups[id]
        }
      }),
      () => {
        setExpandedGroups(this.props.budget.id, this.state.expandedGroups);
      }
    );
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
