import PropTypes from "prop-types";
import moment from "moment";
import { notAny, simpleMemoize } from "../dataUtils";
import {
  getFirstMonth,
  getTransactionMonth,
  isIncome,
  isStartingBalanceOrReconciliation,
  isTransfer
} from "../budgetUtils";

const getFilteredTransactions = simpleMemoize(
  (budget, investmentAccounts, excludeFirstMonth, excludeLastMonth) => {
    const firstMonth = getFirstMonth(budget);
    const lastMonth = moment().format("YYYY-MM");
    return budget.transactions.filter(
      notAny([
        isStartingBalanceOrReconciliation(budget),
        isTransfer(investmentAccounts),
        isIncome(budget),
        transaction =>
          excludeFirstMonth && getTransactionMonth(transaction) === firstMonth,
        transaction =>
          excludeLastMonth && getTransactionMonth(transaction) === lastMonth
      ])
    );
  }
);

const FilteredTransactions = ({
  budget,
  children,
  excludeFirstMonth,
  excludeLastMonth,
  investmentAccounts
}) =>
  children({
    filteredTransactions: getFilteredTransactions(
      budget,
      investmentAccounts,
      excludeFirstMonth,
      excludeLastMonth
    )
  });

FilteredTransactions.propTypes = {
  budget: PropTypes.shape({
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  children: PropTypes.func.isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  investmentAccounts: PropTypes.object.isRequired
};

export default FilteredTransactions;
