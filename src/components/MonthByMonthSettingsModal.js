import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import Label from "./Label";
import { SecondaryText } from "./typeComponents";

const MonthByMonthSettingsModal = ({
  excludeFirstMonth,
  excludeLastMonth,
  open,
  onClose,
  onSetExclusion
}) => (
  <Modal open={open} onClose={onClose} title="Chart Settings">
    <Label>
      <input
        type="checkbox"
        checked={excludeFirstMonth}
        onChange={() => {
          onSetExclusion({ month: "first", exclude: !excludeFirstMonth });
        }}
      />
      &nbsp;Exclude first month
    </Label>
    <Label>
      <input
        type="checkbox"
        checked={excludeLastMonth}
        onChange={() => {
          onSetExclusion({ month: "last", exclude: !excludeLastMonth });
        }}
      />
      &nbsp;Exclude last month
    </Label>
    <SecondaryText style={{ marginTop: 5 }}>
      Excluding incomplete months may lead to more representative averages
    </SecondaryText>
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
