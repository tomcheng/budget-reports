import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getTransactionMonth } from "../utils";
import AnimateHeight from "react-animate-height-auto";
import CollapsibleSection from "./CollapsibleSection";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";
import SeeAll from "./SeeAll";

const LIMIT = 3;

class TransactionsByMonthSection extends Component {
  static propTypes = {
    payeesById: PropTypes.object.isRequired,
    selectedMonth: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  state = { showAll: false };

  handleToggleShowAll = () => {
    this.setState(state => ({ ...state, showAll: !state.showAll }));
  };

  render() {
    const { payeesById, selectedMonth, transactions } = this.props;
    const { showAll } = this.state;

    const transactionsForMonth = compose([
      sortBy("amount"),
      transactions =>
        transactions.filter(
          transaction => getTransactionMonth(transaction) === selectedMonth
        )
    ])(transactions);
    const limitShowing = transactionsForMonth.length > LIMIT + 2;
    const topTransactions = limitShowing ? transactionsForMonth.slice(0, LIMIT) : transactionsForMonth;
    const otherTransactions = limitShowing ? transactionsForMonth.slice(LIMIT) : [];

    return (
      <CollapsibleSection
        title={`Transactions for ${moment(selectedMonth).format("MMMM")}`}
      >
        {topTransactions.length ? (
          topTransactions.map(({ id, date, amount, payeeId }) => (
            <Transaction
              key={id}
              amount={amount}
              payee={payeesById[payeeId]}
              date={date}
            />
          ))
        ) : (
          <NoTransactions />
        )}
        <AnimateHeight isExpanded={showAll}>
          <Fragment>
            {otherTransactions.map(({ id, date, amount, payeeId }) => (
              <Transaction
                key={id}
                isContinuing
                amount={amount}
                payee={payeesById[payeeId]}
                date={date}
              />
            ))}
          </Fragment>
        </AnimateHeight>
        {!!otherTransactions.length && (
          <SeeAll showAll={showAll} onToggle={this.handleToggleShowAll} />
        )}
      </CollapsibleSection>
    );
  }
}

export default TransactionsByMonthSection;
