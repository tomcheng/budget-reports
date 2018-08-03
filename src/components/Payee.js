import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import PageWrapper from "./PageWrapper";
import PayeeBody from "./PayeeBody";

const Payee = ({ budget, payeeId, ...other }) => {
  const payee = get(["payeesById", payeeId])(budget);
  return (
    <PageWrapper
      {...other}
      budgetLoaded={!!budget}
      title={payee ? `Payee: ${payee.name}` : ""}
      content={() => <PayeeBody budget={budget} payee={payee} />}
      backLink
    />
  );
};

Payee.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  payeeId: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default Payee;
