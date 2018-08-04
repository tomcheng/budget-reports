import React, { Component } from "react";
import PropTypes from "prop-types";
import Loading from "./Loading";

class EnsureBudgetLoaded extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    budgetLoaded: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onRequestBudget: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { budgetId, budgetLoaded, onRequestBudget } = this.props;

    if (!budgetLoaded) {
      onRequestBudget(budgetId);
    }
  }

  render() {
    if (!this.props.budgetLoaded) {
      return <Loading />
    }

    return this.props.children;
  }
}

export default EnsureBudgetLoaded;
