import React, { Component } from "react";
import PropTypes from "prop-types";
import { getCurrentMonthLink, getCurrentMonthGroupLink } from "../linkUtils";
import PageWrapper from "./PageWrapper";
import CurrentMonthGroupBody from "./CurrentMonthGroupBody";

class CurrentMonthGroup extends Component {
  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    budgetId: PropTypes.string.isRequired,
    categoryGroupId: PropTypes.string.isRequired,
    currentMonth: PropTypes.string.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.shape({
      categoryGroups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired
        })
      ).isRequired
    }),
    categoryId: PropTypes.string
  };

  render() {
    const {
      budget,
      budgetId,
      categoryGroupId,
      currentMonth,
      categoryId,
      ...other
    } = this.props;

    let title = "";
    const breadcrumbs = [
      {
        label: "Current Month Spending",
        to: getCurrentMonthLink({ budgetId })
      }
    ];

    if (budget) {
      const category = categoryId && budget.categoriesById[categoryId];
      const group = budget.categoryGroupsById[categoryGroupId];
      title = category ? category.name : group.name;

      if (category) {
        breadcrumbs.push({
          label: group.name,
          to: getCurrentMonthGroupLink({ budgetId, categoryGroupId })
        });
      }
    }

    return (
      <PageWrapper
        {...other}
        budgetId={budgetId}
        budgetLoaded={!!budget}
        backLink
        bodyStyle={{
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column"
        }}
        breadcrumbs={breadcrumbs}
        title={title}
        content={() => (
          <CurrentMonthGroupBody
            budget={budget}
            categoryGroupId={categoryGroupId}
            currentMonth={currentMonth}
            categoryId={categoryId}
          />
        )}
      />
    );
  }
}

export default CurrentMonthGroup;
