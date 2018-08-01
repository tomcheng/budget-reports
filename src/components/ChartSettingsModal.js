import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import { PrimaryButton } from "./Button";

class ChartSettingsModal extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    monthsToCompare: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    const { open, monthsToCompare, onClose } = this.props;

    return (
      <Modal open={open} title="Chart Settings" onClose={onClose}>
        Compare with the last {monthsToCompare} month{monthsToCompare === 1
          ? ""
          : "s"}
        <PrimaryButton>Done</PrimaryButton>
      </Modal>
    );
  }
}

export default ChartSettingsModal;
