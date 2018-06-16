import React from "react";
import PropTypes from "prop-types";
import BreakdownNode from "./BreakdownNode";

const Breakdown = ({ nodes, infoRenderer }) =>
  nodes.map(({ id, name, amount, nodes }) => (
    <BreakdownNode
      key={id}
      id={id}
      name={name}
      amount={amount}
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
  infoRenderer: PropTypes.func
};

Breakdown.defaultProps = { reverse: false };

export default Breakdown;
