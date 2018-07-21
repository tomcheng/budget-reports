import React, { Component } from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import { SecondaryText } from "./typeComponents";
import IncomeVsExpensesBody from "./IncomeVsExpensesBody";

class IncomeVsExpenses extends Component {
  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    budgetId: PropTypes.string.isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    mortgageAccounts: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.object
  };

  state = { showing: "average" };

  handleToggleShowing = () => {
    this.setState(state => ({
      ...state,
      showing: state.showing === "average" ? "total" : "average"
    }));
  };

  render() {
    const {
      authorized,
      budget,
      budgetId,
      investmentAccounts,
      mortgageAccounts,
      title,
      onAuthorize,
      onRequestBudget
    } = this.props;
    const { showing } = this.state;

    return (
      <PageWrapper
        authorized={authorized}
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onAuthorize={onAuthorize}
        onRequestBudget={onRequestBudget}
        title={title}
        actions={
          <SecondaryText
            onClick={this.handleToggleShowing}
            style={{ userSelect: "none" }}
          >
            {showing}
          </SecondaryText>
        }
        content={() => (
          <IncomeVsExpensesBody
            budget={budget}
            showing={showing}
            investmentAccounts={investmentAccounts}
            mortgageAccounts={mortgageAccounts}
          />
        )}
      />
    );
  }
}

export default IncomeVsExpenses;
