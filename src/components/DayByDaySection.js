import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useMonthsToCompare, useFlagState } from "../commonHooks";
import CollapsibleSection from "./CollapsibleSection";
import SpendingChart from "./SpendingChart";
import ChartSettingsModal from "./ChartSettingsModal";

const DayByDaySection = ({
  actions,
  budgetId,
  currentMonth,
  highlightFunction,
  title,
  total,
  transactions
}) => {
  const [modalOpen, onCloseModal, onOpenModal] = useFlagState(false);
  const {
    monthsToCompare,
    onIncrementMonths,
    onDecrementMonths
  } = useMonthsToCompare(budgetId);

  return (
    <Fragment>
      <CollapsibleSection
        actions={actions}
        title={title}
        hasSettings
        onClickSettings={onOpenModal}
      >
        <SpendingChart
          budgetId={budgetId}
          currentMonth={currentMonth}
          highlightFunction={highlightFunction}
          monthsToCompare={monthsToCompare}
          total={total}
          transactions={transactions}
        />
      </CollapsibleSection>
      <ChartSettingsModal
        open={modalOpen}
        monthsToCompare={monthsToCompare}
        onClose={onCloseModal}
        onDecrementMonths={onDecrementMonths}
        onIncrementMonths={onIncrementMonths}
      />
    </Fragment>
  );
};

DayByDaySection.propTypes = {
  budgetId: PropTypes.string.isRequired,
  currentMonth: PropTypes.string.isRequired,
  transactions: PropTypes.array.isRequired,
  actions: PropTypes.node,
  highlightFunction: PropTypes.func,
  title: PropTypes.string,
  total: PropTypes.number
};

DayByDaySection.defaultProps = { title: "Day by Day" };

export default DayByDaySection;
