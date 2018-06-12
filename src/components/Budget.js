import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import BudgetBody from "./BudgetBody";

const Budget = ({ budget, budgetId, onRefreshBudget, onRequestBudget }) => (
  <PageWrapper
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onRefreshBudget={onRefreshBudget}
    onRequestBudget={onRequestBudget}
    title="Current Month Budget"
    content={() => <BudgetBody budget={budget} />}
  />
);

Budget.propTypes = {
  budgetId: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Budget;
