import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import get from "lodash/fp/get";
import takeWhile from "lodash/fp/takeWhile";
import { getTransactionMonth, filterTransactions } from "../utils";
import GroupedTransactions from "./GroupedTransactions";

class RecentTransactions extends PureComponent {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          payeeId: PropTypes.string
        })
      ).isRequired,
      payeesById: PropTypes.objectOf(
        PropTypes.shape({ name: PropTypes.string.isRequired })
      ).isRequired
    }).isRequired,
    currentMonth: PropTypes.string.isRequired
  };

  render() {
    const { budget, currentMonth } = this.props;
    const transactions = compose([
      filterTransactions({ budget }),
      takeWhile(
        transaction => getTransactionMonth(transaction) === currentMonth
      )
    ])(budget.transactions);

    return (
      <GroupedTransactions
        transactions={transactions}
        groupBy="date"
        groupDisplayFunction={day => moment(day).format("dddd, MMMM D")}
        leafDisplayFunction={transaction =>
          get(["payeesById", transaction.payeeId, "name"])(budget)
        }
      />
    );
  }
}

export default RecentTransactions;
