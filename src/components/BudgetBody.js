import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import getOr from "lodash/fp/getOr";
import groupBy from "lodash/fp/groupBy";
import maxBy from "lodash/fp/maxBy";
import reverse from "lodash/fp/reverse";
import sortBy from "lodash/fp/sortBy";
import { simpleMemoize } from "../utils";
import { getSetting, setSetting, EXPANDED_GROUPS } from "../uiRepo";
import CategoryGroupListItem from "./CategoryGroupListItem";

class BudgetBody extends PureComponent {
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
      name: PropTypes.string.isRequired
    }),
    showing: PropTypes.oneOf(["available", "spent"]).isRequired,
  };

  constructor(props) {
    super();
    this.state = { expandedGroups: getSetting(EXPANDED_GROUPS, props.budget.id) };
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
        setSetting(EXPANDED_GROUPS, this.props.budget.id, this.state.expandedGroups);
      }
    );
  };

  getSortedCategoryGroups = simpleMemoize(budget => {
    const categoryToGroup = budget.categories.reduce(
      (acc, category) => ({ ...acc, [category.id]: category.categoryGroupId }),
      {}
    );
    const transactionsByGroup = groupBy(t => categoryToGroup[t.categoryId])(
      budget.transactions
    );

    return compose([
      reverse,
      sortBy(
        compose([
          getOr("0000-00-00")("date"),
          maxBy("date"),
          group => transactionsByGroup[group.id]
        ])
      )
    ])(budget.categoryGroups);
  });

  render() {
    const { budget, showing } = this.props;
    const { expandedGroups } = this.state;

    const daysInMonth = moment().daysInMonth();
    const dayOfMonth = parseInt(moment().format("D"), 10);

    return (
      <Fragment>
        {this.getSortedCategoryGroups(budget).map(categoryGroup => (
          <CategoryGroupListItem
            key={categoryGroup.id}
            budgetId={budget.id}
            showing={showing}
            categoryGroup={categoryGroup}
            categories={budget.categories}
            expanded={!!expandedGroups[categoryGroup.id]}
            monthProgress={(dayOfMonth - 0.5) / daysInMonth}
            transactions={budget.transactions}
            onToggleGroup={this.handleToggleGroup}
          />
        ))}
      </Fragment>
    );
  }
}

export default BudgetBody;
