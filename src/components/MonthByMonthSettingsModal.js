import React from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";
import ToggleWithLabel from "./ToggleWithLabel";
import { MinorText } from "./typeComponents";

const MonthByMonthSettingsModal = ({
  excludeFirstMonth,
  excludeLastMonth,
  open,
  onClose,
  onSetExclusion
}) => (
  <Modal open={open} onClose={onClose} title="Chart Settings" width={240}>
    <ToggleWithLabel
      checked={excludeFirstMonth}
      label="Exclude first month"
      name="excludeFirstMonth"
      onChange={() => {
        onSetExclusion({ month: "first", exclude: !excludeFirstMonth });
      }}
    />
    <ToggleWithLabel
      checked={excludeLastMonth}
      label="Exclude last month"
      name="excludeLastMonth"
      onChange={() => {
        onSetExclusion({ month: "last", exclude: !excludeLastMonth });
      }}
    />
    <MinorText style={{ marginTop: 5 }}>
      Excluding incomplete months may lead to more representative averages
    </MinorText>
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
