import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
import prop from "lodash/fp/prop";
import uniq from "lodash/fp/uniq";
import { getFirstMonth, getTransactionMonth } from "../utils";
import MonthByMonthSection from "./MonthByMonthSection";
import PayeeCategoriesSection from "./PayeeCategoriesSection";
import GroupedTransactionsSection from "./GroupedTransactionsSection";
import PayeeTransactionsSection from "./PayeeTransactionsSection";

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
    const { transactions } = budget;
    const transactionsForPayee = transactions.filter(
      transaction => transaction.payeeId === payee.id
    );
    const transactionsForSelectedMonth =
      selectedMonth &&
      transactionsForPayee.filter(
        transaction => getTransactionMonth(transaction) === selectedMonth
      );
    const categoryIds = compose([uniq, map(prop("categoryId"))])(transactionsForPayee);
    const firstMonth = getFirstMonth(budget);

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={transactionsForPayee}
          onSelectMonth={this.handleSelectMonth}
        />
        <PayeeCategoriesSection budget={budget} categoryIds={categoryIds} />
        {selectedMonth ? (
          <PayeeTransactionsSection transactions={transactionsForSelectedMonth} />
          ) : (
          <GroupedTransactionsSection
            transactions={transactionsForPayee}
            groupBy={getTransactionMonth}
            groupDisplayFunction={month => moment(month).format("MMMM YYYY")}
            leafDisplayFunction={transaction =>
              moment(transaction.date).format("dddd, MMMM D")
            }
          />
        )}

      </Fragment>
    );
  }
}

export default Payee;
