import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import sortBy from "lodash/fp/sortBy";
import { groupByProp, sumByProp, sumBy } from "../optimized";
import { simpleMemoize } from "../utils";
import pages, { makeLink } from "../pages";
import { LargeListItemLink } from "./ListItem";
import { SecondaryText } from "./typeComponents";
import Section from "./Section";
import Amount from "./Amount";

const getGroupsWithMeta = simpleMemoize(budget => {
  const { categoryGroups, categories, transactions } = budget;

  const transactionsByCategory = groupByProp("categoryId")(transactions);
  const categoriesByGroup = groupByProp("categoryGroupId")(categories);

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
    sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired
  };

  render() {
    const { budget, sort } = this.props;

    const groupsWithMeta = getGroupsWithMeta(budget);
    const sortedGroups = sortBy(
      sort === "name" ? group => group.name.replace(/[^a-zA-Z0-9]/g, "") : sort
    )(groupsWithMeta);

    return (
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
    );
  }
}

export default Groups;
