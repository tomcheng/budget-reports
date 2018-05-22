import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0 10px;
  
  & + & {
    border-top: 1px dotted #ddd;
  }
`;

const Date = styled.div`
  font-size: 12px;
  line-height: 14px;
  color: #aaa;
`;

const Transaction = ({ payee, date, amount }) => (
  <Container>
    <div>
      <div>{payee.name}</div>
      <Date>{moment(date).format("dddd, MMM D")}</Date>
    </div>
    <div>{-amount}</div>
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
