import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";
import CategoriesBody from "./CategoriesBody";
import GroupBody from "./GroupBody";
import CategoryBody from "./CategoryBody";
import PayeesBody from "./PayeesBody";
import PayeeBody from "./PayeeBody";

const routes = [
  {
    path: "/budgets/:budgetId/categories",
    Component: CategoriesBody,
    props: (params, props) => ({
      budget: props.budget,
      sort: props.settings.categoriesSort
    })
  },
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId",
    Component: GroupBody,
    props: (params, props) => ({
      budget: props.budget,
      categoryGroup: props.budget.categoryGroupsById[params.categoryGroupId]
    })
  },
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId/:categoryId",
    Component: CategoryBody,
    props: (params, props) => ({
      budget: props.budget,
      category: props.budget.categoriesById[params.categoryId]
    })
  },
  {
    path: "/budgets/:budgetId/payees",
    Component: PayeesBody,
    props: (params, props) => ({
      budget: props.budget,
      sort: props.settings.payeesSort
    })
  },
  {
    path: "/budgets/:budgetId/payees/:payeeId",
    Component: PayeeBody,
    props: (params, props) => ({
      budget: props.budget,
      payee: props.budget.payeesById[params.payeeId]
    })
  }
];

const PageContent = ({ budget, settings }) => (
  <Switch>
    {routes.map(({ path, props, Component }) => (
      <Route
        key={path}
        path={path}
        exact
        render={({ match }) => (
          <Component {...props(match.params, { budget, settings })} />
        )}
      />
    ))}
  </Switch>
);

PageContent.propTypes = {
  budget: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default PageContent;
