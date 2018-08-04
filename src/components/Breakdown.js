import React from "react";
import PropTypes from "prop-types";
import BreakdownNode from "./BreakdownNode";

const Breakdown = ({ nodes, valueRenderer }) =>
  nodes.map(({ id, name, amount, nodes }) => (
    <BreakdownNode
      key={id}
      id={id}
      name={name}
      amount={amount}
      nodes={nodes}
      valueRenderer={valueRenderer}
      isTopLevel
    />
  ));

Breakdown.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
      nodes: PropTypes.array
    })
  ).isRequired,
  valueRenderer: PropTypes.func
};

Breakdown.defaultProps = { reverse: false };

export default Breakdown;
