import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { getFirstMonth, getTransactionMonth } from "../utils";
import pages, { makeLink } from "../pages";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

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
    const { category, budget } = this.props;
    const { selectedMonth } = this.state;
    const { transactions, payeesById, id: budgetId } = budget;
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
          onSelectMonth={this.handleSelectMonth}
        />
        <GenericEntitiesSection
          entitiesById={payeesById}
          entityKey="payeeId"
          linkFunction={payeeId =>
            makeLink(pages.payee.path, { budgetId, payeeId })
          }
          title="Payees"
          transactions={transactionsForMonth || transactionsForCategory}
          showTransactionCount={false}
        />
      </Fragment>
    );
  }
}

export default Category;
