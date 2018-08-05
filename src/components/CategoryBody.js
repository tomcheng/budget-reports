import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth } from "../utils";
import { getPayeeLink } from "../linkUtils";
import MonthByMonthSection from "./MonthByMonthSection";
import GenericEntitiesSection from "./GenericEntitiesSection";

class CategoryBody extends PureComponent {
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
    const firstMonth = getTransactionMonth(
      transactions[transactions.length - 1]
    );
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
          linkFunction={payeeId => getPayeeLink({ budgetId, payeeId })}
          title="Payees"
          transactions={transactionsForMonth || transactionsForCategory}
        />
      </Fragment>
    );
  }
}

export default CategoryBody;
