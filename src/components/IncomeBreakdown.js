import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { getPayeeNodes } from "../utils";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";

const IncomeBreakdown = ({ selectedMonth, transactions, payeesById }) => {
  const nodes = getPayeeNodes({ payeesById, transactions });
  return (
    <Section>
      <StrongText>
        Income for {moment(selectedMonth, "YYYY-MM").format("MMMM YYYY")}
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
  selectedMonth: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      categoryId: PropTypes.string
    })
  ).isRequired
};

export default IncomeBreakdown;
