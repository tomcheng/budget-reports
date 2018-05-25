import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getExpandedGroups, setExpandedGroups } from "../uiRepo";
import GetBudget from "./GetBudget";
import MainLayout from "./MainLayout";
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
    onRefreshBudget: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
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
      name: PropTypes.string.isRequired
    })
  };

  constructor(props) {
    super();
    this.state = { expandedGroups: getExpandedGroups(props.budgetId) };
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
    const {
      budget,
      budgetId,
      currentUrl,
      currentMonth,
      onRefreshBudget,
      onRequestBudget
    } = this.props;
    const { expandedGroups } = this.state;

    const daysInMonth = moment(currentMonth).daysInMonth();
    const dayOfMonth = parseInt(moment().format("D"), 10);

    return (
      <GetBudget
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onRequestBudget={onRequestBudget}
      >
        {() => (
          <MainLayout
            title={budget.name}
            onRefreshBudget={onRefreshBudget}
            budgetId={budget.id}
          >
            {budget.categoryGroups
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
              ))}
          </MainLayout>
        )}
      </GetBudget>
    );
  }
}

export default Budget;
