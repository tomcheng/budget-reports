import React from "react";
import groupBy from "lodash/fp/groupBy";
import sumBy from "lodash/fp/sumBy";
import moment from "moment";
import CollapsibleSection from "./CollapsibleSection";
import Breakdown from "./Breakdown";
import { SecondaryText } from "./typeComponents";
import Amount from "./Amount";

const NetWorthChanges = ({ months, accountSummaries, hiddenAccounts }) => {
  const totals = months.map(month => ({ month, total: 0 }));
  accountSummaries.forEach(({ id, data }) => {
    if (hiddenAccounts[id]) {
      return;
    }

    data.forEach((num, index) => {
      totals[index].total += num;
    });
  });

  const changes = totals
    .map((t, i) => ({
      year: t.month.slice(0, 4),
      month: t.month,
      change: i === 0 ? null : t.total - totals[i - 1].total
    }))
    .reverse();

  const years = groupBy("year")(changes);

  const nodes = Object.keys(years)
    .sort()
    .reverse()
    .map(year => ({
      amount: sumBy("change")(years[year]),
      id: year,
      name: year,
      nodes: years[year].map(v => ({
        amount: v.change,
        name: moment(v.month).format("MMMM"),
        id: v.month
      }))
    }));

  return (
    <CollapsibleSection title="Net Worth Changes">
      <Breakdown
        nodes={nodes}
        valueRenderer={({ faded, amount }) => (
          <SecondaryText style={{ opacity: faded ? 0.3 : 1 }}>
            <Amount amount={amount} positiveColor="green" negativeColor="red" />
          </SecondaryText>
        )}
      />
    </CollapsibleSection>
  );
};

export default NetWorthChanges;
