import React, { Component } from "react";
import PropTypes from "prop-types";
import ErrorPage from "./ErrorPage";

class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string
  };

  static defaultProps = {
    message: "Something went wrong"
  };

  state = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage message={this.props.message} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
