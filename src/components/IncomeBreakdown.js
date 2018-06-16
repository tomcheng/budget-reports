import React from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { getPayeeNodes } from "../utils";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";
import BreakdownPercentage from "./BreakdownPercentage";

const IncomeBreakdown = ({ transactions, payeesById, divideBy }) => {
  const nodes = getPayeeNodes({ payeesById, transactions }, divideBy);
  const total = sumBy("amount")(nodes);
  return (
    <Section>
      <StrongText>Income Breakdown</StrongText>
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
