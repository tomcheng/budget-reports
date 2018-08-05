import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import compose from "lodash/fp/compose";
import groupBy from "lodash/fp/groupBy";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import sumBy from "lodash/fp/sumBy";
import { getCategoryGroupLink } from "../linkUtils";
import { LargeListItemLink } from "./ListItem";
import { SecondaryText, MinorText } from "./typeComponents";
import Section from "./Section";
import Amount from "./Amount";

class CategoriesBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired
  };

  render() {
    const { budget, sort } = this.props;
    const { categoryGroups, categories, transactions } = budget;
    const transactionsByCategory = groupBy("categoryId")(transactions);
    const categoriesByGroup = groupBy("categoryGroupId")(categories);
    const groupsWithMeta = compose([
      groups => (sort === "transactions" ? groups.reverse() : groups),
      sortBy(
        sort === "name"
          ? group => group.name.replace(/[^a-zA-Z0-9]/g, "")
          : sort
      ),
      map(group => {
        const amount = sumBy(category =>
          sumBy("amount")(transactionsByCategory[category.id])
        )(categoriesByGroup[group.id]);
        const transactions = sumBy(
          category => (transactionsByCategory[category.id] || []).length
        )(categoriesByGroup[group.id]);

        return { ...group, amount, transactions };
      })
    ])(categoryGroups);

    return (
      <Section noPadding>
        {groupsWithMeta.map(group => (
          <LargeListItemLink
            key={group.id}
            to={getCategoryGroupLink({
              budgetId: budget.id,
              categoryGroupId: group.id
            })}
          >
            <div style={{ whiteSpace: "pre" }}>
              {group.name}
            </div>
            <SecondaryText style={{ textAlign: "right" }}>
              <Amount amount={group.amount} />
              <MinorText>
                {group.transactions} transaction{group.transactions === 1
                  ? ""
                  : "s"}
              </MinorText>
            </SecondaryText>
          </LargeListItemLink>
        ))}
      </Section>
    );
  }
}

export default CategoriesBody;
