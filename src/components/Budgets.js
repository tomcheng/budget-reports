import React from "react";
import PropTypes from "prop-types";

const Budgets = ({ budgets, onSelectBudget }) => (
  <div>
    {budgets.map(({ id, name }) => (
      <div
        key={id}
        onClick={() => {
          onSelectBudget(id);
        }}
      >
        {name}
      </div>
    ))}
  </div>
);

Budgets.propTypes = {
  budgets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  onSelectBudget: PropTypes.func.isRequired
};

export default Budgets;
