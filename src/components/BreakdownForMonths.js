import React, { Fragment } from "react";
import PropTypes from "prop-types";
import sumBy from "lodash/fp/sumBy";
import { splitTransactions } from "../utils";
import ExpensesBreakdown from "./ExpensesBreakdown";
import IncomeBreakdown from "./IncomeBreakdown";

const BreakdownForMonths = ({
  categoriesById,
  categoryGroupsById,
  payeesById,
  transactions,
  months
}) => {
  const { incomeTransactions, expenseTransactions } = splitTransactions({
    categoryGroupsById,
    categoriesById,
    transactions
  });

  return (
    <Fragment>
      <ExpensesBreakdown
        categoriesById={categoriesById}
        categoryGroupsById={categoryGroupsById}
        payeesById={payeesById}
        transactions={expenseTransactions}
        totalIncome={sumBy("amount")(incomeTransactions) / months}
        months={months}
      />
      <IncomeBreakdown
        payeesById={payeesById}
        transactions={incomeTransactions}
        months={months}
      />
    </Fragment>
  );
};

BreakdownForMonths.propTypes = {
  categoriesById: PropTypes.object.isRequired,
  categoryGroupsById: PropTypes.object.isRequired,
  payeesById: PropTypes.object.isRequired,
  months: PropTypes.number.isRequired,
  transactions: PropTypes.array.isRequired
};

export default BreakdownForMonths;
