import { Component } from "react";
import PropTypes from "prop-types";

class Scroller extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired,
    location: PropTypes.string.isRequired,
  };

  toBeScrolled = null;

  scrollPositions = {};

  getSnapshotBeforeUpdate() {
    return { scrollTop: this.toBeScrolled.scrollTop };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { action, location } = this.props;

    if (location === prevProps.location) {
      return;
    }

    if (action === "POP") {
      this.toBeScrolled.scrollTop = this.scrollPositions[location] || 0;
    }

    if (action === "PUSH") {
      this.scrollPositions[prevProps.location] = snapshot.scrollTop;
      this.toBeScrolled.scrollTop = 0;
    }

    if (action === "REPLACE") {
      this.toBeScrolled.scrollTop = 0;
    }
  }

  render() {
    return this.props.children({
      ref: el => {
        this.toBeScrolled = el;
      }
    });
  }
}

export default Scroller;
