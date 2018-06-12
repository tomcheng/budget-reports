import React, { Component } from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import { SecondaryText } from "./typeComponents";
import BudgetBody from "./BudgetBody";

class Budget extends Component {
  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    budgetId: PropTypes.string.isRequired,
    onAuthorize: PropTypes.func.isRequired,
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
    const { authorized, budget, budgetId, onAuthorize, onRequestBudget } = this.props;
    const { showing } = this.state;

    return (
      <PageWrapper
        authorized={authorized}
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onAuthorize={onAuthorize}
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
