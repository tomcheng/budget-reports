import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { getFirstMonth, filterTransactions } from "../utils";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

class Payee extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          payee_id: PropTypes.string.isRequired
        })
      ).isRequired,
      payeesById: PropTypes.object.isRequired
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
    const { payee, budget } = this.props;
    const { selectedMonth } = this.state;
    const { transactions, payeesById, categoriesById } = budget;
    const transactionsForPayee = filterTransactions({ budget })(transactions.filter(
      transaction => transaction.payee_id === payee.id
    ));
    const firstMonth = getFirstMonth(budget);

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={transactionsForPayee}
          onSelectMonth={this.handleSelectMonth}
        />
        {selectedMonth && (
          <TransactionsByMonthSection
            categoriesById={categoriesById}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            transactions={transactionsForPayee}
            limitShowing={false}
          />
        )}
      </Fragment>
    );
  }
}

export default Payee;
