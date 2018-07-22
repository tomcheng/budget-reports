import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getPayeeLink } from "../utils";
import { MinorText, SecondaryText } from "./typeComponents";
import Amount from "./Amount";

const Container = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;

  & + & {
    border-top: 1px solid #eee;
  }
`;

const Stats = styled.div`
  text-align: right;
`;

const PayeeListItem = ({ name, amount, transactions, id, budgetId }) => (
  <Container to={getPayeeLink({ budgetId, payeeId: id })}>
    {name}
    <Stats>
      <SecondaryText>
        <Amount amount={amount} />
      </SecondaryText>
      <MinorText style={{ whiteSpace: "nowrap" }}>
        {transactions} transaction{transactions === 1 ? "" : "s"}
      </MinorText>
    </Stats>
  </Container>
);

PayeeListItem.propTypes = {
  amount: PropTypes.number.isRequired,
  budgetId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  transactions: PropTypes.number.isRequired
};

export default PayeeListItem;
