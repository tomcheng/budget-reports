import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import { getFirstMonth } from "../budgetUtils";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

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
    }).isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string
  };

  render() {
    const {
      budget,
      categoryGroup,
      payee,
      selectedMonth,
      onSelectMonth
    } = this.props;
    const { transactions, categories, categoriesById, payeesById } = budget;
    const firstMonth = getFirstMonth(budget);

    const categoriesInGroup = categories.filter(
      category => category.category_group_id === categoryGroup.id
    );
    const categoryIds = categoriesInGroup.map(category => category.id);
    const transactionsForGroupAndPayee = transactions.filter(
      transaction =>
        categoryIds.includes(transaction.category_id) &&
        transaction.payee_id === payee.id
    );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={transactionsForGroupAndPayee}
          onSelectMonth={onSelectMonth}
        />
        {selectedMonth && (
          <TransactionsByMonthSection
            categoriesById={categoriesById}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            transactions={transactionsForGroupAndPayee}
            limitShowing={false}
          />
        )}
      </Fragment>
    );
  }
}

export default GroupPayee;
