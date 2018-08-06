import React from "react";
import PropTypes from "prop-types";
import pages from "../pages";
import { Switch, Route } from "react-router-dom";
import SortDropdown from "./SortDropdown";
import { SecondaryText } from "./typeComponents";

const defaultSortOptions = [
  { label: "Amount", value: "amount" },
  { label: "Transactions", value: "transactions" },
  { label: "Name", value: "name" }
];

const PageActions = ({ settings, onChangeSetting }) => (
  <Switch>
    <Route
      path={pages.categories.path}
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
      path={pages.payees.path}
      exact
      render={() => (
        <SortDropdown
          options={defaultSortOptions}
          selected={settings.payeesSort}
          onChange={value => onChangeSetting({ setting: "payeesSort", value })}
        />
      )}
    />
    <Route
      path={pages.incomeVsExpenses.path}
      exact
      render={() => (
        <SecondaryText
          onClick={() => {
            onChangeSetting({
              setting: "incomeVsExpensesShowing",
              value:
                settings.incomeVsExpensesShowing === "average"
                  ? "total"
                  : "average"
            });
          }}
          style={{ userSelect: "none" }}
        >
          {settings.incomeVsExpensesShowing}
        </SecondaryText>
      )}
    />
  </Switch>
);

PageActions.propTypes = {
  settings: PropTypes.object.isRequired,
  onChangeSetting: PropTypes.func.isRequired
};

export default PageActions;
