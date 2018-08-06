import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";
import {
  getCategoryGroupLink,
  getCategoryGroupsLink,
  getPayeesLink
} from "../linkUtils";
import { MinorText } from "./typeComponents";
import Icon from "./Icon";

const routes = [
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId",
    breadcrumbs: params => [
      {
        label: "Categories",
        to: getCategoryGroupsLink({ budgetId: params.budgetId })
      }
    ]
  },
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId/:categoryId",
    breadcrumbs: (params, budget) => [
      {
        label: "Categories",
        to: getCategoryGroupsLink({ budgetId: params.budgetId })
      },
      {
        label: budget.categoryGroupsById[params.categoryGroupId].name,
        to: getCategoryGroupLink({
          budgetId: params.budgetId,
          categoryGroupId: params.categoryGroupId
        })
      }
    ]
  },
  {
    path: "/budgets/:budgetId/payees/:payeeId",
    breadcrumbs: params => [
      {
        label: "Payees",
        to: getPayeesLink({ budgetId: params.budgetId })
      }
    ]
  }
];

const PageBreadcrumbs = ({ budget }) =>
  budget && (
    <Switch>
      {routes.map(({ path, breadcrumbs }) => (
        <Route
          key={path}
          path={path}
          exact
          render={props => (
            <MinorText style={{ lineHeight: 1, whiteSpace: "normal" }}>
              {breadcrumbs(props.match.params, budget).map(
                ({ label, to }, index) => (
                  <Fragment key={to}>
                    <Link
                      to={to}
                      style={{
                        paddingBottom: 8,
                        display: "inline-block"
                      }}
                    >
                      {label}
                    </Link>
                    {index !== breadcrumbs.length - 1 && (
                      <Icon
                        icon="chevron-right"
                        style={{ padding: "0 5px", fontSize: 8 }}
                      />
                    )}
                  </Fragment>
                )
              )}
            </MinorText>
          )}
        />
      ))}
    </Switch>
  );

PageBreadcrumbs.propTypes = {
  budget: PropTypes.object
};

export default PageBreadcrumbs;
