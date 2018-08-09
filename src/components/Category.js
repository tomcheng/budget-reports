import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { getFirstMonth, getTransactionMonth } from "../utils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";
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
    const { transactions, categoriesById, payeesById, id: budgetId } = budget;
    const firstMonth = getFirstMonth(budget);
    const transactionsForCategory = transactions.filter(
      transaction => transaction.categoryId === category.id
    );
    const transactionsForMonth =
      selectedMonth &&
      transactionsForCategory.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          transactions={transactionsForCategory}
          selectedMonth={selectedMonth}
          onSelectMonth={onSelectMonth}
        />
        {selectedMonth && (
          <TransactionsByMonthSection
            key={`transactions-${selectedMonth}`}
            categoriesById={categoriesById}
            payeesById={payeesById}
            transactions={transactionsForMonth}
            selectedMonth={selectedMonth}
          />
        )}
        <GenericEntitiesSection
          key={`payees-${selectedMonth || "all"}`}
          entitiesById={payeesById}
          entityKey="payeeId"
          linkFunction={payeeId =>
            makeLink(pages.categoryPayee.path, {
              budgetId,
              categoryGroupId: category.categoryGroupId,
              categoryId: category.id,
              payeeId
            })
          }
          title={
            selectedMonth
              ? `Payees for ${moment(selectedMonth).format("MMMM")}`
              : "Payees"
          }
          transactions={transactionsForMonth || transactionsForCategory}
          showTransactionCount
          limitShowing
        />
      </Fragment>
    );
  }
}

export default Category;
