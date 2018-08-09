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
          payee_id: PropTypes.string.isRequired
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
    const {
      budget,
      category,
      payee,
      selectedMonth,
      onSelectMonth
    } = this.props;
    const { transactions, categoriesById, payeesById } = budget;
    const firstMonth = getFirstMonth(budget);
    const transactionsForCategoryAndPayee = transactions.filter(
      transaction =>
        transaction.category_id === category.id &&
        transaction.payee_id === payee.id
    );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          transactions={transactionsForCategoryAndPayee}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
        />
        {selectedMonth && (
          <TransactionsByMonthSection
            categoriesById={categoriesById}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            transactions={transactionsForCategoryAndPayee}
            limitShowing={false}
          />
        )}
      </Fragment>
    );
  }
}

export default Category;
