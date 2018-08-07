import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import CollapsibleSection from "./CollapsibleSection";
import { SecondaryText, MinorText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import NoTransactions from "./NoTransactions";

const PayeeTransactionsSection = ({ payeeName, transactions }) => (
  <CollapsibleSection title="Transactions">
    {transactions.length ? (
      transactions.map(({ id, date, amount }) => (
        <ListItem key={id}>
          <div>
            <SecondaryText>{payeeName}</SecondaryText>
            <MinorText>{moment(date).format("dddd, MMMM D")}</MinorText>
            
          </div>
          <SecondaryText>
            <Amount amount={amount} />
          </SecondaryText>
        </ListItem>
      ))
    ) : (
      <NoTransactions />
    )}
  </CollapsibleSection>
);

PayeeTransactionsSection.propTypes = {
  payeeName: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default PayeeTransactionsSection;
