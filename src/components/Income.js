import React, { Fragment } from "react";
import PropTypes from "prop-types";
import MonthByMonthSection from "./MonthByMonthSection";
import { getTransactionMonth, sanitizeName } from "../budgetUtils";
import moment from "moment";
import { useSelectedMonth, useSelectedPayeeId } from "../commonHooks";
import GenericEntitiesSection from "./GenericEntitiesSection";

const Income = ({
  budget,
  excludeFirstMonth,
  excludeLastMonth,
  months,
  transactions,
  onSetExclusion
}) => {
  const [selectedMonth, onSelectMonth] = useSelectedMonth();
  const [selectedPayeeId, onSelectPayeeId] = useSelectedPayeeId();

  const { payeesById } = budget;
  const transactionsInSelectedMonth =
    selectedMonth &&
    transactions.filter(
      transaction => getTransactionMonth(transaction) === selectedMonth
    );

  return (
    <Fragment>
      <MonthByMonthSection
        excludeFirstMonth={excludeFirstMonth}
        excludeLastMonth={excludeLastMonth}
        highlightFunction={
          selectedPayeeId &&
          (transaction => transaction.payee_id === selectedPayeeId)
        }
        months={months}
        selectedMonth={selectedMonth}
        title={
          selectedPayeeId
            ? `Month by Month: ${sanitizeName(
                payeesById[selectedPayeeId].name
              )}`
            : "Month by Month"
        }
        transactions={transactions}
        onSelectMonth={onSelectMonth}
        onSetExclusion={onSetExclusion}
      />
      <GenericEntitiesSection
        key={`payee-${selectedMonth || "all"}`}
        entityKey="payee_id"
        entitiesById={payeesById}
        title={
          selectedMonth
            ? `Payees: ${moment(selectedMonth).format("MMMM")}`
            : "Payees"
        }
        transactions={transactionsInSelectedMonth || transactions}
        selectedEntityId={selectedPayeeId}
        onClickEntity={onSelectPayeeId}
        showAverageToggle={false}
        showAverage={!selectedMonth}
        numMonths={months.length}
        limitShowing
      />
    </Fragment>
  );
};

Income.propTypes = {
  budget: PropTypes.shape({
    payeesById: PropTypes.object.isRequired
  }).isRequired,
  excludeFirstMonth: PropTypes.bool.isRequired,
  excludeLastMonth: PropTypes.bool.isRequired,
  onSetExclusion: PropTypes.func.isRequired,
  months: PropTypes.array.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      payee_id: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Income;
