import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const MonthByMonthSettingsModal = ({
  excludeFirstMonth,
  excludeLastMonth,
  open,
  onClose,
  onSetExclusion
}) => (
  <Modal open={open} onClose={onClose} title="Chart Settings">
    <div>
      <label>
        <input
          type="checkbox"
          checked={excludeFirstMonth}
          onChange={() => {
            onSetExclusion({ month: "first", exclude: !excludeFirstMonth });
          }}
        />{" "}
        Exclude first month
      </label>
    </div>
    <div>
      <label>
        <input
          type="checkbox"
          checked={excludeLastMonth}
          onChange={() => {
            onSetExclusion({ month: "last", exclude: !excludeLastMonth });
          }}
        />{" "}
        Exclude last month
      </label>
    </div>
    Excluding incomplete months may lead to more representative averages
  </Modal>
);

MonthByMonthSettingsModal.propTypes = {
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSetExclusion: PropTypes.func.isRequired
};

export default MonthByMonthSettingsModal;
