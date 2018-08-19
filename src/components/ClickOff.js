import { Component } from "react";
import PropTypes from "prop-types";

const isDescendant = (parent, child) => {
  let node = child.parentNode;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

class ClickOff extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    onClickOff: PropTypes.func
  };

  parent = null;

  componentDidMount() {
    document.body.addEventListener("click", this.handleBodyClick);
  }

  componentWillUnmount() {
    document.body.removeEventListener("click", this.handleBodyClick);
  }

  handleBodyClick = evt => {
    if (this.props.onClickOff && !isDescendant(this.parent, evt.target)) {
      this.props.onClickOff();
    }
  };

  render() {
    return this.props.children({
      ref: el => {
        this.parent = el;
      }
    });
  }
}

export default ClickOff;
