import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";
import pages, { makeLink } from "../pages";
import { MinorText } from "./typeComponents";
import Icon from "./Icon";

const routes = [
  {
    path: "/budgets/:budgetId/current/:categoryGroupId",
    breadcrumbs: params => [
      {
        label: "Current Month Spending",
        to: makeLink(pages.currentMonth.path, { budgetId: params.budgetId })
      }
    ]
  },
  {
    path: "/budgets/:budgetId/current/:categoryGroupId/:categoryId",
    breadcrumbs: (params, budget) => [
      {
        label: "Current Month Spending",
        to: makeLink(pages.currentMonth.path, { budgetId: params.budgetId })
      },
      {
        label: budget.categoryGroupsById[params.categoryGroupId].name,
        to: makeLink(pages.currentMonthGroup.path, {
          budgetId: params.budgetId,
          categoryGroupId: params.categoryGroupId
        })
      }
    ]
  },
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId",
    breadcrumbs: params => [
      {
        label: "Categories",
        to: makeLink(pages.categories.path, { budgetId: params.budgetId })
      }
    ]
  },
  {
    path: "/budgets/:budgetId/category-groups/:categoryGroupId/:categoryId",
    breadcrumbs: (params, budget) => [
      {
        label: "Categories",
        to: makeLink(pages.categories.path, { budgetId: params.budgetId })
      },
      {
        label: budget.categoryGroupsById[params.categoryGroupId].name,
        to: makeLink(pages.group.path, {
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
        to: makeLink(pages.payees.path, { budgetId: params.budgetId })
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
