import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

class Category extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    category: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    excludeFirstMonth: PropTypes.bool.isRequired,
    excludeLastMonth: PropTypes.bool.isRequired,
    months: PropTypes.arrayOf(PropTypes.string).isRequired,
    payee: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        payee_id: PropTypes.string.isRequired
      })
    ).isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    onSetExclusion: PropTypes.func.isRequired,
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
      excludeFirstMonth,
      excludeLastMonth,
      months,
      payee,
      selectedMonth,
      transactions,
      onSelectMonth,
      onSetExclusion
    } = this.props;
    const { categoriesById, payeesById } = budget;

    const transactionsForCategoryAndPayee = transactions.filter(
      transaction =>
        transaction.category_id === category.id &&
        transaction.payee_id === payee.id
    );

    return (
      <Fragment>
        <MonthByMonthSection
          excludeFirstMonth={excludeFirstMonth}
          excludeLastMonth={excludeLastMonth}
          months={months}
          selectedMonth={selectedMonth}
          transactions={transactionsForCategoryAndPayee}
          onSelectMonth={onSelectMonth}
          onSetExclusion={onSetExclusion}
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
