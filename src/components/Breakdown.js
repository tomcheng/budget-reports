import React from "react";
import PropTypes from "prop-types";
import BreakdownNode from "./BreakdownNode";

const Breakdown = ({ nodes, total, infoRenderer }) =>
  nodes.map(({ id, name, amount, nodes }) => (
    <BreakdownNode
      key={id}
      name={name}
      amount={amount}
      total={total}
      nodes={nodes}
      infoRenderer={infoRenderer}
      isTopLevel
    />
  ));

Breakdown.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      nodes: PropTypes.array
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
  infoRenderer: PropTypes.func
};

Breakdown.defaultProps = { reverse: false };

export default Breakdown;
