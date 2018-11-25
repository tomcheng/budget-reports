import { useRef, useState } from "react";

export const useSelectedMonth = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const selectedMonthRef = useRef(selectedMonth);
  selectedMonthRef.current = selectedMonth;

  const onSelectMonth = month => {
    setSelectedMonth(month === selectedMonthRef.current ? null : month);
  };

  return [selectedMonth, onSelectMonth];
};

export const useSelectedPayeeId = () => {
  const [selectedPayeeId, setSelectedPayeeId] = useState(null);
  const onSelectPayeeId = payeeId => {
    setSelectedPayeeId(payeeId === selectedPayeeId ? null : payeeId);
  };

  return [selectedPayeeId, onSelectPayeeId];
};
