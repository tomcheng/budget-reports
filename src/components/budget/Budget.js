import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import getOr from "lodash/fp/getOr";
import groupBy from "lodash/fp/groupBy";
import maxBy from "lodash/fp/maxBy";
import reverse from "lodash/fp/reverse";
import sortBy from "lodash/fp/sortBy";
import { simpleMemoize } from "../../utils";
import { getExpandedGroups, setExpandedGroups } from "../../uiRepo";
import GetBudget from "../GetBudget";
import Layout from "../common/Layout";
import { PageTitle } from "../common/typeComponents";
import PageActions from "../header/PageActions";
import CategoryGroupListItem from "./CategoryGroupListItem";

class Budget extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
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
      sortBy(compose([
        getOr("0000-00-00")("date"),
        maxBy("date"),
        group => transactionsByGroup[group.id]
      ]))
    ])(budget.categoryGroups);
  });

  render() {
    const {
      budget,
      budgetId,
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
          <Layout>
            <Layout.Header flushRight>
              <PageTitle>{budget.name}</PageTitle>
              <PageActions
                budgetId={budget.id}
                onRefreshBudget={onRefreshBudget}
              />
            </Layout.Header>
            <Layout.Body>
              {this.getSortedCategoryGroups(budget).map(categoryGroup => (
                <CategoryGroupListItem
                  key={categoryGroup.id}
                  budgetId={budgetId}
                  categoryGroup={categoryGroup}
                  categories={budget.categories.filter(
                    c => c.categoryGroupId === categoryGroup.id
                  )}
                  expanded={!!expandedGroups[categoryGroup.id]}
                  monthProgress={(dayOfMonth - 0.5) / daysInMonth}
                  transactions={budget.transactions}
                  onToggleGroup={this.handleToggleGroup}
                />
              ))}
            </Layout.Body>
          </Layout>
        )}
      </GetBudget>
    );
  }
}

export default Budget;
