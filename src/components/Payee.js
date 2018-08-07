import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { getFirstMonth } from "../utils";
import MonthByMonthSection from "./MonthByMonthSection";
import TransactionsByMonthSection from "./TransactionsByMonthSection";

class Payee extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          payeeId: PropTypes.string.isRequired
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
    const { transactions, payeesById } = budget;
    const transactionsForPayee = transactions.filter(
      transaction => transaction.payeeId === payee.id
    );
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
            firstMonth={firstMonth}
            payeesById={payeesById}
            selectedMonth={selectedMonth}
            transactions={transactionsForPayee}
          />
        )}
      </Fragment>
    );
  }
}

export default Payee;
