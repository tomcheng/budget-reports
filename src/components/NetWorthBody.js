import React, { Component } from "react";
import PropTypes from "prop-types";

class NetWorthBody extends Component {
  static propTypes = {
    budget: PropTypes.shape({}).isRequired
  };

  render() {
    const { budget } = this.props;
    return <div>{budget.name}</div>;
  }
}

export default NetWorthBody;
