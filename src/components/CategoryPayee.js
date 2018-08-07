import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { getFirstMonth } from "../utils";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsForPayeeSection from "./TransactionsForPayeeSection";

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
    payee: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string
  };

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  render() {
    const { budget, category, payee, selectedMonth, onSelectMonth } = this.props;
    const { transactions } = budget;
    const firstMonth = getFirstMonth(budget);
    const transactionsForCategoryAndPayee = transactions.filter(
      transaction =>
        transaction.categoryId === category.id &&
        transaction.payeeId === payee.id
    );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          transactions={transactionsForCategoryAndPayee}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
        />
        <TransactionsForPayeeSection
          firstMonth={firstMonth}
          payee={payee}
          selectedMonth={selectedMonth}
          transactions={transactionsForCategoryAndPayee}
          onSelectMonth={onSelectMonth}
        />
      </Fragment>
    );
  }
}

export default Category;
