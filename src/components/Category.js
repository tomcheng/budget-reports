import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import SpendingChart from "./SpendingChart";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  font-weight: 600;
`;

const Category = ({
  category,
  currentMonth,
  payees,
  transactions,
  onRefreshData
}) => (
  <Fragment>
    <Header>
      <div>{category.name}</div>
      <div>
        <button onClick={onRefreshData}>Refresh Data</button>
      </div>
    </Header>
    <div style={{ padding: "0 20px 20px" }}>
      <SpendingChart
        budgeted={category.budgeted}
        currentMonth={currentMonth}
        transactions={transactions}
      />
    </div>
    {transactions.map(({ id, payeeId, date, amount }) => (
      <div key={id}>
        <div>{payees[payeeId].name}</div>
        <div>{date}</div>
        <div>{amount}</div>
      </div>
    ))}
  </Fragment>
);

Category.propTypes = {
  category: PropTypes.shape({
    budgeted: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  currentMonth: PropTypes.string.isRequired,
  payees: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      payeeId: PropTypes.string.isRequired
    })
  ).isRequired,
  onRefreshData: PropTypes.func.isRequired
};

export default Category;
