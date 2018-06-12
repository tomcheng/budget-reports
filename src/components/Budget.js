import React, { Component } from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import { SecondaryText } from "./typeComponents";
import BudgetBody from "./BudgetBody";

class Budget extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    onRefreshBudget: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.object
  };

  state = { showing: "available" };

  handleToggleShowing = () => {
    this.setState(state => ({
      ...state,
      showing: state.showing === "available" ? "spent" : "available"
    }));
  };

  render() {
    const { budget, budgetId, onRefreshBudget, onRequestBudget } = this.props;
    const { showing } = this.state;

    return (
      <PageWrapper
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onRefreshBudget={onRefreshBudget}
        onRequestBudget={onRequestBudget}
        title="Current Month Budget"
        actions={
          <SecondaryText onClick={this.handleToggleShowing}>
            {showing}
          </SecondaryText>
        }
        content={() => <BudgetBody budget={budget} showing={showing} />}
      />
    );
  }
}

export default Budget;
