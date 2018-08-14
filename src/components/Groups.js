import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/fp/sortBy";
import { simpleMemoize, groupByProp, sumByProp, sumBy, notAny } from "../optimized";
import { getFirstMonth, isStartingBalanceOrReconciliation, isTransfer, isIncome } from "../budgetUtils";
import pages, { makeLink } from "../pages";
import { LargeListItemLink } from "./ListItem";
import { SecondaryText } from "./typeComponents";
import Section from "./Section";
import Amount from "./Amount";
import MonthByMonthSection from "./MonthByMonthSection";

const getGroupsWithMeta = simpleMemoize(budget => {
  const { categoryGroups, categories, transactions } = budget;

  const transactionsByCategory = groupByProp("category_id")(transactions);
  const categoriesByGroup = groupByProp("category_group_id")(categories);

  return categoryGroups.map(group => {
    const amount = sumBy(category =>
      sumByProp("amount")(transactionsByCategory[category.id] || [])
    )(categoriesByGroup[group.id]);
    const transactions = sumBy(
      category => (transactionsByCategory[category.id] || []).length
    )(categoriesByGroup[group.id]);

    return { ...group, amount, transactions };
  });
});

class Groups extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    investmentAccounts: PropTypes.object.isRequired,
    sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired,
    onSelectMonth: PropTypes.func.isRequired,
    selectedMonth: PropTypes.string
  };

  render() {
    const { budget, investmentAccounts, sort, selectedMonth, onSelectMonth } = this.props;
    const firstMonth = getFirstMonth(budget);
    const filteredTransactions = budget.transactions.filter(notAny([
      isStartingBalanceOrReconciliation(budget),
      isTransfer(investmentAccounts),
      isIncome(budget)
    ]));

    const groupsWithMeta = getGroupsWithMeta(budget);
    const sortedGroups = sortBy(
      sort === "name" ? group => group.name.replace(/[^a-zA-Z0-9]/g, "") : sort
    )(groupsWithMeta);

    return (
      <Fragment>
        <MonthByMonthSection
          firstMonth={firstMonth}
          selectedMonth={selectedMonth}
          transactions={filteredTransactions}
          onSelectMonth={onSelectMonth}
        />
        <Section noPadding>
          {sortedGroups.map(group => (
            <LargeListItemLink
              key={group.id}
              to={makeLink(pages.group.path, {
                budgetId: budget.id,
                categoryGroupId: group.id
              })}
            >
              <div style={{ whiteSpace: "pre" }}>{group.name}</div>
              <SecondaryText style={{ textAlign: "right" }}>
                <Amount amount={group.amount} />
              </SecondaryText>
            </LargeListItemLink>
          ))}
        </Section>
      </Fragment>
    );
  }
}

export default Groups;
