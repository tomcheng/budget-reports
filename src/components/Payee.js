import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import { getPayeesLink } from "../linkUtils";
import PageWrapper from "./PageWrapper";
import PayeeBody from "./PayeeBody";

const Payee = ({ budget, budgetId, payeeId, ...other }) => {
  const payee = get(["payeesById", payeeId])(budget) || {};
  return (
    <PageWrapper
      {...other}
      budgetId={budgetId}
      budgetLoaded={!!budget}
      title={payee.name}
      breadcrumbs={[
        {
          label: "Payees",
          to: getPayeesLink({ budgetId })
        }
      ]}
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
