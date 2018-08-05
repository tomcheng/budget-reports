import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import { getTransactionMonth } from "../utils";
import MonthByMonthSection from "./MonthByMonthSection";

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
    const { transactions } = budget;
    const firstMonth = getTransactionMonth(
      transactions[transactions.length - 1]
    );
    const transactionsForCategory = transactions.filter(
      transaction => transaction.categoryId === category.id
    );

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          transactions={transactionsForCategory}
          selectedMonth={selectedMonth}
          onSelectMonth={this.handleSelectMonth}
        />
      </Fragment>
    );
  }
}

export default CategoryBody;
