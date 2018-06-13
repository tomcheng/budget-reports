import React, { Component } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";

class NetWorthBody extends Component {
  static propTypes = {
    budget: PropTypes.shape({
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          accountId: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired
        })
      ).isRequired
    }).isRequired
  };

  render() {
    const { budget } = this.props;
    const summary = compose([
      mapValues(groupBy("accountId")),
      groupBy(({ date }) => date.slice(0, 7))
    ])(budget.transactions);
    console.log("summary:", summary);
    return <div>{budget.name}</div>;
  }
}

export default NetWorthBody;
