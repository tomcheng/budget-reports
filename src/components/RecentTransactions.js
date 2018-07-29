import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import takeWhile from "lodash/fp/takeWhile";
import ListItem from "./ListItem";
import { MinorText, SecondaryText } from "./typeComponents";
import Amount from "./Amount";

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
    }).isRequired
  };

  render() {
    const { budget } = this.props;
    const cutOffTime = moment().subtract(7, "days");

    return takeWhile(({ date }) => moment(date).isSameOrAfter(cutOffTime))(
      budget.transactions
    ).map(transaction => {
      const payee = budget.payeesById[transaction.payeeId];
      return (
        <ListItem key={transaction.id}>
          <div>
            <SecondaryText>{payee.name}</SecondaryText>
            <MinorText>
              {moment(transaction.date).format("dddd, MMM D")}
            </MinorText>
          </div>
          <SecondaryText>
            <Amount amount={transaction.amount} />
          </SecondaryText>
        </ListItem>
      );
    });
  }
}

export default RecentTransactions;
