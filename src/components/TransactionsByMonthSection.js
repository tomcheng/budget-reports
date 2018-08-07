import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import sortBy from "lodash/fp/sortBy";
import { getTransactionMonth } from "../utils";
import CollapsibleSection from "./CollapsibleSection";
import { SecondaryText } from "./typeComponents";
import Transaction from "./Transaction";
import NoTransactions from "./NoTransactions";

const LIMIT = 4;

class TransactionsByMonthSection extends Component {
  static propTypes = {
    payeesById: PropTypes.object.isRequired,
    selectedMonth: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  state = { showAll: false };

  handleClickSeeAll = () => {
    this.setState({ showAll: true });
  };

  handleClickSeeLess = () => {
    this.setState({ showAll: false });
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
    const topTransactions = showAll
      ? transactionsForMonth
      : transactionsForMonth.slice(0, LIMIT);
    const otherTransactions = showAll ? [] : transactionsForMonth.slice(LIMIT);

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
        {!!otherTransactions.length && (
          <SecondaryText
            style={{ textAlign: "center", color: "#999" }}
            onClick={this.handleClickSeeAll}
          >
            see all
          </SecondaryText>
        )}
        {showAll && (
          <SecondaryText
            style={{ textAlign: "center", color: "#999" }}
            onClick={this.handleClickSeeLess}
          >
            see less
          </SecondaryText>
        )}
      </CollapsibleSection>
    );
  }
}

export default TransactionsByMonthSection;
