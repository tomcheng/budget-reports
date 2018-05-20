import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Budgets = ({ budgets }) => (
  <div>
    {budgets.map(({ id, name }) => (
      <Link key={id} to={`/budgets/${id}`}>
        {name}
      </Link>
    ))}
  </div>
);

Budgets.propTypes = {
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Budgets;
