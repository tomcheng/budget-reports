import React from "react";
import PropTypes from "prop-types";
import Button from "./Button";
import Toggle from "./Toggle";

const IncomeVsExpensesChartControls = ({
  hasSelection,
  toggles,
  onClearSelected,
  onToggle
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    {hasSelection ? (
      <Button onClick={onClearSelected}>clear selected</Button>
    ) : (
      toggles.map(({ label, key, value }) => (
        <Toggle
          key={key}
          label={label}
          value={value}
          onToggle={() => {
            onToggle(key);
          }}
        />
      ))
    )}
  </div>
);

IncomeVsExpensesChartControls.propTypes = {
  hasSelection: PropTypes.bool.isRequired,
  toggles: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      value: PropTypes.bool.isRequired
    })
  ).isRequired,
  onClearSelected: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired
};

export default IncomeVsExpensesChartControls;
