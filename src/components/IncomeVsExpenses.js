import React, { Component } from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import IncomeVsExpensesBody from "./IncomeVsExpensesBody";

class IncomeVsExpenses extends Component {
  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    budgetId: PropTypes.string.isRequired,
    mortgageAccounts: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.object
  };

  render() {
    const {
      authorized,
      budget,
      budgetId,
      mortgageAccounts,
      title,
      onAuthorize,
      onRequestBudget
    } = this.props;

    return (
      <PageWrapper
        authorized={authorized}
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onAuthorize={onAuthorize}
        onRequestBudget={onRequestBudget}
        title={title}
        content={() => (
          <IncomeVsExpensesBody
            budget={budget}
            mortgageAccounts={mortgageAccounts}
          />
        )}
      />
    );
  }
}

export default IncomeVsExpenses;
