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
    categoriesById: PropTypes.object.isRequired,
    payeesById: PropTypes.object.isRequired,
    selectedMonth: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
    limitShowing: PropTypes.bool
  };

  static defaultProps = { limitShowing: true };

  state = { allMounted: false, showAll: false };

  handleToggleShowAll = () => {
    const { allMounted, showAll } = this.state;

    if (allMounted) {
      this.setState({ showAll: !showAll });
    } else {
      this.setState({ allMounted: true });
      requestAnimationFrame(() => {
        this.setState({ showAll: true });
      });
    }
  };

  render() {
    const {
      categoriesById,
      payeesById,
      selectedMonth,
      transactions,
      limitShowing: limitShowingProp
    } = this.props;
    const { allMounted, showAll } = this.state;

    const transactionsForMonth = compose([
      limitShowingProp
        ? sortBy("amount")
        : transactions => transactions.reverse(),
      transactions =>
        transactions.filter(
          transaction => getTransactionMonth(transaction) === selectedMonth
        )
    ])(transactions);
    const limitShowing =
      limitShowingProp && transactionsForMonth.length > LIMIT + 2;
    const topTransactions = limitShowing
      ? transactionsForMonth.slice(0, LIMIT)
      : transactionsForMonth;
    const otherTransactions = limitShowing
      ? transactionsForMonth.slice(LIMIT)
      : [];

    return (
      <CollapsibleSection
        title={`Transactions for ${moment(selectedMonth).format("MMMM")}`}
      >
        {topTransactions.length ? (
          topTransactions.map(
            ({
              id,
              date,
              amount,
              payee_id: payeeId,
              category_id: categoryId
            }) => (
              <Transaction
                key={id}
                amount={amount}
                category={categoriesById[categoryId]}
                date={date}
                payee={payeesById[payeeId]}
              />
            )
          )
        ) : (
          <NoTransactions />
        )}
        {allMounted && (
          <AnimateHeight isExpanded={showAll}>
            <Fragment>
              {otherTransactions.map(
                ({
                  id,
                  date,
                  amount,
                  payee_id: payeeId,
                  category_id: categoryId
                }) => (
                  <Transaction
                    key={id}
                    amount={amount}
                    category={categoriesById[categoryId]}
                    date={date}
                    payee={payeesById[payeeId]}
                    isContinuing
                  />
                )
              )}
            </Fragment>
          </AnimateHeight>
        )}
        {!!otherTransactions.length && (
          <SeeAll
            count={transactionsForMonth.length}
            pluralizedName="transactions"
            showAll={showAll}
            onToggle={this.handleToggleShowAll}
          />
        )}
      </CollapsibleSection>
    );
  }
}

export default TransactionsByMonthSection;
