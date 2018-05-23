import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getExpandedGroups, setExpandedGroups } from "../uiRepo";
import Loading from "./Loading";
import CategoryGroupListItem from "./CategoryGroupListItem";

const GROUPS_TO_HIDE = [
  "Internal Master Category",
  "Credit Card Payments",
  "Hidden Categories"
];

class Budget extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    currentUrl: PropTypes.string.isRequired,
    onRequestBudgetDetails: PropTypes.func.isRequired,
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
    })
  };

  constructor(props) {
    super();
    this.state = { expandedGroups: getExpandedGroups(props.budgetId) };
  }

  componentDidMount() {
    if (!this.props.budget) {
      this.props.onRequestBudgetDetails(this.props.budgetId);
    }
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
    const { budget, currentUrl, currentMonth } = this.props;
    const { expandedGroups } = this.state;

    if (!budget) {
      return <Loading />;
    }

    const daysInMonth = moment(currentMonth).daysInMonth();
    const dayOfMonth = parseInt(moment().format("D"), 10);

    return budget.categoryGroups
      .filter(g => !GROUPS_TO_HIDE.includes(g.name))
      .map(categoryGroup => (
        <CategoryGroupListItem
          key={categoryGroup.id}
          categoryGroup={categoryGroup}
          categories={budget.categories.filter(
            c => c.categoryGroupId === categoryGroup.id
          )}
          currentUrl={currentUrl}
          expanded={!!expandedGroups[categoryGroup.id]}
          onToggleGroup={this.handleToggleGroup}
          monthProgress={(dayOfMonth - 0.5) / daysInMonth}
        />
      ));
  }
}

export default Budget;
