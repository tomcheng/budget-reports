import React, { Fragment } from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/fp/sumBy";
import ExpensesBreakdown from "./ExpensesBreakdown";
import IncomeBreakdown from "./IncomeBreakdown";

const Breakdowns = ({
  categoriesById,
  categoryGroupsById,
  payeesById,
  expenseTransactions,
  incomeTransactions,
  divideBy,
  budgetId
}) => {
  return (
    <Fragment>
      <ExpensesBreakdown
        budgetId={budgetId}
        categoriesById={categoriesById}
        categoryGroupsById={categoryGroupsById}
        payeesById={payeesById}
        transactions={expenseTransactions}
        totalIncome={sumBy("amount")(incomeTransactions) / divideBy}
        divideBy={divideBy}
      />
      <IncomeBreakdown
        budgetId={budgetId}
        payeesById={payeesById}
        transactions={incomeTransactions}
        divideBy={divideBy}
      />
    </Fragment>
  );
};

Breakdowns.propTypes = {
  budgetId: PropTypes.string.isRequired,
  categoriesById: PropTypes.object.isRequired,
  categoryGroupsById: PropTypes.object.isRequired,
  expenseTransactions: PropTypes.array.isRequired,
  incomeTransactions: PropTypes.array.isRequired,
  payeesById: PropTypes.object.isRequired,
  divideBy: PropTypes.number.isRequired
};

export default Breakdowns;
