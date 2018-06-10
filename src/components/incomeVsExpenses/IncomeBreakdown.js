import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { getPayeeNodes } from "../../utils";
import { StrongText } from "../common/typeComponents";
import Section from "../common/Section";
import Breakdown from "./Breakdown";

const IncomeBreakdown = ({
  selectedMonth,
  transactions,
  payeesById,
  months
}) => {
  const nodes = getPayeeNodes({ payeesById, transactions }, months);
  return (
    <Section>
      <StrongText>
        {selectedMonth
          ? `Income for ${moment(selectedMonth, "YYYY-MM").format("MMMM YYYY")}`
          : "Average Income per Month"}
      </StrongText>
      <Breakdown
        nodes={sortBy("amount")(nodes).reverse()}
        total={sumBy("amount")(nodes)}
      />
    </Section>
  );
};

IncomeBreakdown.propTypes = {
  payeesById: PropTypes.objectOf(PropTypes.object).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired,
  months: PropTypes.number,
  selectedMonth: PropTypes.string
};

IncomeBreakdown.defaultProps = { months: 1 };

export default IncomeBreakdown;
