import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import { Switch, Route } from "react-router-dom";

const routes = [
  {
    path: "/budgets/:budgetId/categories",
    title: "Categories"
  },
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId",
    title: (params, budget) =>
      get(["categoryGroupsById", params.categoryGroupId, "name"])(budget)
  },
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId/:categoryId",
    title: (params, budget) =>
      get(["categoriesById", params.categoryId, "name"])(budget)
  },
  {
    path: "/budgets/:budgetId/payees",
    title: "Payees"
  },
  {
    path: "/budgets/:budgetId/payees/:payeeId",
    title: (params, budget) =>
      get(["payeesById", params.payeeId, "name"])(budget)
  }
];

const PageTitle = ({ budget }) =>
  budget && (
    <Switch>
      {routes.map(({ path, title }) => (
        <Route
          key={path}
          path={path}
          exact
          render={props =>
            typeof title === "function"
              ? title(props.match.params, budget)
              : title
          }
        />
      ))}
    </Switch>
  );

PageTitle.propTypes = {
  budget: PropTypes.object
};

export default PageTitle;
