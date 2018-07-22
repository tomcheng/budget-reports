import React from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import PayeesBody from "./PayeesBody";

const Payees = ({
  authorized,
  budget,
  budgetId,
  title,
  onAuthorize,
  onRequestBudget
}) => (
  <PageWrapper
    authorized={authorized}
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onAuthorize={onAuthorize}
    onRequestBudget={onRequestBudget}
    title={title}
    content={() => <PayeesBody budget={budget} />}
  />
);

Payees.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Payees;
