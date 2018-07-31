import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import compose from "lodash/fp/compose";
import map from "lodash/fp/map";
import prop from "lodash/fp/prop";
import uniq from "lodash/fp/uniq";
import { getMetadataForPayee, getTransactionMonth } from "../utils";
import TopNumbers from "./TopNumbers";
import PayeeCategories from "./PayeeCategories";
import GroupedTransactions from "./GroupedTransactions";
import Section, { TopSection } from "./Section";

class PayeeBody extends PureComponent {
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

  render() {
    const { payee, budget } = this.props;
    const { amount, transactions, transactionCount } = getMetadataForPayee({
      budget,
      payeeId: payee.id
    });
    const categoryIds = compose([uniq, map(prop("categoryId"))])(transactions);

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
        <Section title="Categories">
          <PayeeCategories budget={budget} categoryIds={categoryIds} />
        </Section>
        <Section title="Transactions">
          <GroupedTransactions
            transactions={transactions}
            groupBy={getTransactionMonth}
            groupDisplayFunction={month => moment(month).format("MMMM YYYY")}
            leafDisplayFunction={transaction =>
              moment(transaction.date).format("dddd, MMMM D")
            }
          />
        </Section>
      </Fragment>
    );
  }
}

export default PayeeBody;
