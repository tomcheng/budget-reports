import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import groupBy from "lodash/fp/groupBy";
import { getCategoryLink } from "../linkUtils";
import { Link } from "react-router-dom";
import Section from "./Section";

class CategoriesBody extends PureComponent {
  static propTypes = {
    budget: PropTypes.object.isRequired,
    sort: PropTypes.oneOf(["amount", "name", "transactions"]).isRequired
  };

  render() {
    const { budget } = this.props;
    const { transactions, categories, categoryGroups } = budget;
    const transactionsByCategory = groupBy("categoryId")(transactions);
    const categoriesByGroup = groupBy("categoryGroupId")(categories);

    return (
      <Section noPadding>
        {categoryGroups.map(group => (
          <div key={group.id}>
            <div>{group.name}</div>
            {(categoriesByGroup[group.id] || []).map(category => (
              <div key={category.id}>
                <Link
                  to={getCategoryLink({
                    budgetId: budget.id,
                    categoryId: category.id
                  })}
                >
                  {category.name} -{" "}
                  {(transactionsByCategory[category.id] || []).length}{" "}
                  transactions
                </Link>
              </div>
            ))}
          </div>
        ))}
      </Section>
    );
  }
}

export default CategoriesBody;
