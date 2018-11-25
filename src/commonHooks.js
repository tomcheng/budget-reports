import { useRef, useState } from "react";
import moment from "moment";
import { getSetting, setSetting } from "./uiRepo";
import { getFirstMonth } from "./budgetUtils";

export const useSelectedMonth = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const selectedMonthRef = useRef(selectedMonth);
  selectedMonthRef.current = selectedMonth;

  const onSelectMonth = month => {
    setSelectedMonth(month === selectedMonthRef.current ? null : month);
  };

  return [selectedMonth, onSelectMonth];
};

export const useSelectedEntityId = () => {
  const [selectedEntityId, setSelectedEntityId] = useState(null);
  const onSelectEntityId = entityId => {
    setSelectedEntityId(entityId === selectedEntityId ? null : entityId);
  };

  return [selectedEntityId, onSelectEntityId];
};

export const useTrendsShowAverage = budgetId => {
  const [showAverage, setShowAverage] = useState(
    getSetting("trendsShowAverage", budgetId)
  );
  const onToggleShowAverage = () => {
    setShowAverage(!showAverage);
    setSetting("trendsShowAverage", budgetId, !showAverage);
  };

  return [showAverage, onToggleShowAverage];
};

const getMonths = (firstMonth, lastMonth) => {
  const months = [firstMonth];
  let m = firstMonth;

  while (m !== lastMonth) {
    m = moment(m)
      .add(1, "months")
      .format("YYYY-MM");
    months.push(m);
  }

  return months;
};

export const useMonthExclusions = budget => {
  const [excludeFirstMonth, setExcludeFirstMonth] = useState(
    getSetting("excludeFirstMonth", budget.id)
  );
  const [excludeLastMonth, setExcludeLastMonth] = useState(
    getSetting("excludeLastMonth", budget.id)
  );

  const firstBudgetMonth = getFirstMonth(budget);
  const firstMonth = excludeFirstMonth
    ? moment(firstBudgetMonth)
        .add(1, "months")
        .format("YYYY-MM")
    : firstBudgetMonth;
  const lastMonth = excludeLastMonth
    ? moment()
        .subtract(1, "months")
        .format("YYYY-MM")
    : moment().format("YYYY-MM");
  const months = getMonths(firstMonth, lastMonth);

  const onSetExclusion = ({ month, exclude }) => {
    if (month === "first") {
      setExcludeFirstMonth(exclude);
      setSetting("excludeFirstMonth", budget.id, exclude);
    } else {
      setExcludeLastMonth(exclude);
      setSetting("excludeLastMonth", budget.id, exclude);
    }
  };

  return { excludeFirstMonth, excludeLastMonth, months, onSetExclusion };
};
