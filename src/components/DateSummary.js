import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import { ListSectionHeader } from "./typeComponents";
import EmptyText from "./EmptyText";
import DateSummaryTransaction from "./DateSummaryTransaction";

const Container = styled.div`
  margin-bottom: 15px;
`;

const DateSummary = ({ categoriesById, date, payeesById, transactions }) => (
  <Container>
    <ListSectionHeader>
      {moment(date).calendar(null, {
        sameDay: "[Today]",
        nextDay: "[Tomorrow]",
        nextWeek: "dddd",
        lastDay: "[Yesterday]",
        lastWeek: "[Last] dddd",
        sameElse: "DD/MM/YYYY"
      })}
    </ListSectionHeader>
    <div>
      {transactions.length ? (
        transactions.map(transaction => (
          <DateSummaryTransaction
            key={transaction.id}
            amount={transaction.amount}
            payee={payeesById[transaction.payee_id]}
            category={categoriesById[transaction.category_id]}
          />
        ))
      ) : (
        <EmptyText style={{ margin: 0 }}>no transactions</EmptyText>
      )}
    </div>
  </Container>
);

DateSummary.propTypes = {
  categoriesById: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  payeesById: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category_id: PropTypes.string,
      payee_id: PropTypes.string
    })
  ).isRequired
};

export default DateSummary;
