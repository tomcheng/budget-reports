import React, { Fragment } from "react";
import PropTypes from "prop-types";
import BreakdownNode from "./BreakdownNode";

const Breakdown = ({ nodes, total }) => {
  return (
    <Fragment>
      {nodes.map(({ id, name, amount, nodes }) => (
        <BreakdownNode
          key={id}
          name={name}
          amount={amount}
          total={total}
          nodes={nodes}
          isTopLevel
        />
      ))}
    </Fragment>
  );
};

Breakdown.propTypes = {
  nodes: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      nodes: PropTypes.array.isRequired
    })
  ).isRequired,
  total: PropTypes.number.isRequired
};

Breakdown.defaultProps = { reverse: false };

export default Breakdown;
