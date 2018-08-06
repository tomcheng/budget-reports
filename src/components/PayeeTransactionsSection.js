import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import CollapsibleSection from "./CollapsibleSection";
import { SecondaryText } from "./typeComponents";
import ListItem from "./ListItem";
import Amount from "./Amount";
import NoTransactions from "./NoTransactions";

const PayeeTransactionsSection = ({ transactions }) => (
  <CollapsibleSection title="Transactions">
    {transactions.length ? (
      transactions.map(({ id, date, amount }) => (
        <ListItem key={id}>
          <SecondaryText>{moment(date).format("dddd, MMMM D")}</SecondaryText>
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
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired
    })
  ).isRequired
};

export default PayeeTransactionsSection;
