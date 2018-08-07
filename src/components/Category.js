import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { getFirstMonth } from "../utils";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

class Category extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          payeeId: PropTypes.string.isRequired
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    category: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string
  };

  render() {
    const { category, budget, selectedMonth, onSelectMonth } = this.props;
    const { transactions, payeesById } = budget;
    const firstMonth = getFirstMonth(budget);
    const transactionsForCategory = transactions.filter(
      transaction => transaction.categoryId === category.id
    );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          transactions={transactionsForCategory}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
        />
        <TransactionsByMonthSection
          onSelectMonth={onSelectMonth}
          payeesById={payeesById}
          transactions={transactionsForCategory}
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
        />
      </Fragment>
    );
  }
}

export default Category;
