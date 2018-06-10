import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import groupBy from "lodash/groupBy";
import keys from "lodash/keys";
import pick from "lodash/pick";
import sortBy from "lodash/sortBy";
import sumBy from "lodash/sumBy";
import { StrongText } from "./typeComponents";
import Section from "./Section";
import Breakdown from "./Breakdown";

const IncomeBreakdown = ({ selectedMonth, transactions, payeesById }) => {
  const total = sumBy(transactions, "amount");
  const transactionsByPayee = groupBy(transactions, "payeeId");
  const payees = keys(payeesById)
    .filter(id => !!transactionsByPayee[id])
    .map(id => ({
      ...pick(payeesById[id], ["id", "name"]),
      amount: sumBy(transactionsByPayee[id], "amount")
    }));

  const groupsAndPayees = sortBy(payees, "amount").reverse();

  return (
    <Section>
      <StrongText>
        Income for {moment(selectedMonth, "YYYY-MM").format("MMMM YYYY")}
      </StrongText>
      <Breakdown nodes={groupsAndPayees} total={total} />
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
