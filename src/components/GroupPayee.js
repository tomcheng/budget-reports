import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { getFirstMonth } from "../utils";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsForPayeeSection from "./TransactionsForPayeeSection";

class GroupPayee extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          categoryId: PropTypes.string
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
    }).isRequired,
    categoryGroup: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired,
    payee: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  };

  state = { selectedMonth: null };

  handleSelectMonth = month => {
    this.setState(state => ({
      ...state,
      selectedMonth: state.selectedMonth === month ? null : month
    }));
  };

  render() {
    const { budget, categoryGroup, payee } = this.props;
    const { selectedMonth } = this.state;
    const { transactions, categories } = budget;
    const firstMonth = getFirstMonth(budget);

    const categoriesInGroup = categories.filter(
      category => category.categoryGroupId === categoryGroup.id
    );
    const categoryIds = categoriesInGroup.map(category => category.id);
    const transactionsForGroupAndPayee = transactions.filter(
      transaction =>
        categoryIds.includes(transaction.categoryId) &&
        transaction.payeeId === payee.id
    );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={transactionsForGroupAndPayee}
          onSelectMonth={this.handleSelectMonth}
        />
        <TransactionsForPayeeSection
          payeeName={payee.name}
          selectedMonth={selectedMonth}
          transactions={transactionsForGroupAndPayee}
        />
      </Fragment>
    );
  }
}

export default GroupPayee;
