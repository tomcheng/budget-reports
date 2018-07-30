import React from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { Link } from "react-router-dom";
import { getPayeeNodes } from "../utils";
import { getPayeeLink } from "../linkUtils";
import Section from "./Section";
import Breakdown from "./Breakdown";
import BreakdownPercentage from "./BreakdownPercentage";

const IncomeBreakdown = ({ transactions, payeesById, divideBy, budgetId }) => {
  const nodes = getPayeeNodes({ payeesById, transactions }, divideBy).map(
    payee => ({
      ...payee,
      name: (
        <Link to={getPayeeLink({ budgetId, payeeId: payee.id })}>
          {payee.name}
        </Link>
      )
    })
  );
  const total = sumBy("amount")(nodes);
  return (
    <Section title="Income Breakdown">
      <Breakdown
        nodes={sortBy("amount")(nodes).reverse()}
        total={total}
        infoRenderer={({ amount }) => (
          <BreakdownPercentage amount={amount} total={total} />
        )}
      />
    </Section>
  );
};

IncomeBreakdown.propTypes = {
  budgetId: PropTypes.string.isRequired,
  divideBy: PropTypes.number.isRequired,
  payeesById: PropTypes.objectOf(PropTypes.object).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

IncomeBreakdown.defaultProps = { divideBy: 1 };

export default IncomeBreakdown;
