import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import SortDropdown from "./SortDropdown";

const defaultSortOptions = [
  { label: "Amount", value: "amount" },
  { label: "Transactions", value: "transactions" },
  { label: "Name", value: "name" }
];

const PageActions = ({ settings, onChangeSetting }) => (
  <Switch>
    <Route
      path="/budgets/:budgetId/categories"
      exact
      render={() => (
        <SortDropdown
          options={defaultSortOptions}
          selected={settings.categoriesSort}
          onChange={value =>
            onChangeSetting({ setting: "categoriesSort", value })
          }
        />
      )}
    />
    <Route
      path="/budgets/:budgetId/payees"
      exact
      render={() => (
        <SortDropdown
          options={defaultSortOptions}
          selected={settings.payeesSort}
          onChange={value => onChangeSetting({ setting: "payeesSort", value })}
        />
      )}
    />
  </Switch>
);

PageActions.propTypes = {
  settings: PropTypes.object.isRequired,
  onChangeSetting: PropTypes.func.isRequired
};

export default PageActions;
