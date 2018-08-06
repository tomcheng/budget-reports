import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
import prop from "lodash/fp/prop";
import uniq from "lodash/fp/uniq";
import {
  getMetadataForPayee,
  getFirstMonth,
  getTransactionMonth
} from "../utils";
import TopNumbers from "./TopNumbers";
import MonthByMonthSection from "./MonthByMonthSection";
import PayeeCategoriesSection from "./PayeeCategoriesSection";
import GroupedTransactionsSection from "./GroupedTransactionsSection";
import { TopSection } from "./Section";

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
    const { amount, transactions, transactionCount } = getMetadataForPayee({
      budget,
      payeeId: payee.id
    });
    const categoryIds = compose([uniq, map(prop("categoryId"))])(transactions);
    const firstMonth = getFirstMonth(budget);

    return (
      <Fragment>
        <TopSection>
          <TopNumbers
            numbers={[
              { label: "total amount", value: Math.abs(amount) },
              {
                label: "transactions",
                value: transactionCount,
                currency: false
              },
              {
                label: "amount/transaction",
                value: Math.abs(amount) / transactionCount
              }
            ]}
          />
        </TopSection>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={transactions}
          onSelectMonth={this.handleSelectMonth}
        />
        <PayeeCategoriesSection budget={budget} categoryIds={categoryIds} />
        <GroupedTransactionsSection
          transactions={transactions}
          groupBy={getTransactionMonth}
          groupDisplayFunction={month => moment(month).format("MMMM YYYY")}
          leafDisplayFunction={transaction =>
            moment(transaction.date).format("dddd, MMMM D")
          }
        />
      </Fragment>
    );
  }
}

export default Payee;
