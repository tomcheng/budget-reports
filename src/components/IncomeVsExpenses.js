import React, { Component } from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import IncomeVsExpensesBody from "./IncomeVsExpensesBody";

class IncomeVsExpenses extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    onRefreshBudget: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.object
  };

  render() {
    const { budget, budgetId, onRefreshBudget, onRequestBudget } = this.props;

    return (
      <PageWrapper
        budgetId={budgetId}
        budget={budget}
        onRefreshBudget={onRefreshBudget}
        onRequestBudget={onRequestBudget}
        title="Income vs Expenses"
      >
        <IncomeVsExpensesBody budget={budget} />
      </PageWrapper>
    );
  }
}

export default IncomeVsExpenses;
