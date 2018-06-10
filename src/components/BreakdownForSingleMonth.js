import React, { Fragment } from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/fp/sumBy";
import ExpensesBreakdown from "./ExpensesBreakdown";
import IncomeBreakdown from "./IncomeBreakdown";

const BreakdownForSingleMonth = ({
  categoriesById,
  categoryGroupsById,
  payeesById,
  selectedMonth,
  expenseTransactions,
  incomeTransactions
}) => (
  <Fragment>
    <ExpensesBreakdown
      categoriesById={categoriesById}
      categoryGroupsById={categoryGroupsById}
      payeesById={payeesById}
      selectedMonth={selectedMonth}
      transactions={expenseTransactions}
      totalIncome={sumBy("amount")(incomeTransactions)}
    />
    <IncomeBreakdown
      payeesById={payeesById}
      selectedMonth={selectedMonth}
      transactions={incomeTransactions}
    />
  </Fragment>
);

BreakdownForSingleMonth.propTypes = {
  categoriesById: PropTypes.object.isRequired,
  categoryGroupsById: PropTypes.object.isRequired,
  payeesById: PropTypes.object.isRequired,
  selectedMonth: PropTypes.string.isRequired,
  expenseTransactions: PropTypes.array.isRequired,
  incomeTransactions: PropTypes.array.isRequired
};

export default BreakdownForSingleMonth;
