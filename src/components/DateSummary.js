import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import ListItem from "./ListItem";
import moment from "moment";
import { MinorText } from "./typeComponents";
import { sumByProp } from "../dataUtils";
import EmptyText from "./EmptyText";
import DateSummaryTransaction from "./DateSummaryTransaction";
import ToggleNode from "./ToggleNode";

const Container = styled(ListItem)`
  display: block;
`;

const DateSummary = ({
  categoriesById,
  date,
  expanded,
  payeesById,
  transactions,
  onToggleExpanded
}) => (
  <Container>
    <ToggleNode
      amount={sumByProp("amount")(transactions)}
      expanded={expanded}
      name={
        <div style={{ display: "flex", alignItems: "baseline" }}>
          {moment(date).calendar(null, {
            sameDay: "[Today]",
            nextDay: "[Tomorrow]",
            nextWeek: "dddd",
            lastDay: "[Yesterday]",
            lastWeek: "dddd",
            sameElse: "DD/MM/YYYY"
          })}
          {!expanded && (
            <MinorText>
              {" "}
              &ndash; {transactions.length} transaction
              {transactions.length === 1 ? "" : "s"}
            </MinorText>
          )}
        </div>
      }
      onToggle={onToggleExpanded}
      isCompact
    />
    <AnimateHeight isExpanded={expanded}>
      <div style={{ paddingLeft: 18 }}>
        {transactions.length ? (
          transactions.map(transaction => (
            <DateSummaryTransaction
              key={transaction.id}
              amount={transaction.amount}
              payee={payeesById[transaction.payee_id]}
              category={categoriesById[transaction.category_id]}
              memo={transaction.memo}
            />
          ))
        ) : (
          <EmptyText style={{ margin: 0 }}>no transactions</EmptyText>
        )}
      </div>
    </AnimateHeight>
  </Container>
);

DateSummary.propTypes = {
  categoriesById: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  payeesById: PropTypes.object.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      category_id: PropTypes.string,
      payee_id: PropTypes.string
    })
  ).isRequired,
  onToggleExpanded: PropTypes.func.isRequired
};

export default DateSummary;
