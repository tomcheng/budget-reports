import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";
import Amount from "./Amount";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  
  & + & {
    border-top: 1px dotted #ddd;
  }
`;

const Date = styled.div`
  margin-top: -4px;
  font-size: 12px;
  line-height: 20px;
  color: #aaa;
`;

const Transaction = ({ payee, date, amount }) => (
  <Container>
    <div>
      <div>{payee.name}</div>
      <Date>{moment(date).format("dddd, MMM D")}</Date>
    </div>
    <Amount amount={amount} />
  </Container>
);

Transaction.propTypes = {
  amount: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  payee: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired
};

export default Transaction;
