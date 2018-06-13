import React, { Component } from "react";
import PropTypes from "prop-types";
import PageWrapper from "./PageWrapper";
import NetWorthBody from "./NetWorthBody";

class NetWorth extends Component {
  static propTypes = {
    authorized: PropTypes.bool.isRequired,
    budgetId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onAuthorize: PropTypes.func.isRequired,
    onRequestBudget: PropTypes.func.isRequired,
    budget: PropTypes.object
  };

  render() {
    const {
      authorized,
      budget,
      budgetId,
      title,
      onAuthorize,
      onRequestBudget
    } = this.props;

    return (
      <PageWrapper
        authorized={authorized}
        budgetId={budgetId}
        budgetLoaded={!!budget}
        onAuthorize={onAuthorize}
        onRequestBudget={onRequestBudget}
        title={title}
        content={() => <NetWorthBody budget={budget} />}
      />
    );
  }
}

export default NetWorth;
