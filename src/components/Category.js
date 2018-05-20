import React from "react";
import PropTypes from "prop-types";
import { formatCurrency } from "../utils";
import SpendingChart from "./SpendingChart";

const Category = ({ category, transactions, payees, onClearCategory }) => (
  <div>
    <div onClick={onClearCategory}>Back</div>
    <div>{category.name}</div>
    <SpendingChart transactions={transactions} />
    {transactions.map(({ id, payeeId, date, amount }) => (
      <div key={id}>
        <div>{payees[payeeId].name}</div>
        <div>{date}</div>
        <div>{formatCurrency(amount)}</div>
      </div>
    ))}
  </div>
);

Category.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
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
  onClearCategory: PropTypes.func.isRequired,
};

export default Category;
