import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";
import pages, { makeLink } from "../pages";
import { MinorText } from "./typeComponents";
import Icon from "./Icon";

const routes = [
  {
    path: pages.currentMonthGroup.path,
    breadcrumbs: params => [
      {
        label: pages.currentMonth.title,
        to: makeLink(pages.currentMonth.path, { budgetId: params.budgetId })
      }
    ]
  },
  {
    path: pages.currentMonthCategory.path,
    breadcrumbs: (params, budget) => [
      {
        label: pages.currentMonth.title,
        to: makeLink(pages.currentMonth.path, { budgetId: params.budgetId })
      },
      {
        label: pages.currentMonthGroup.title(params, budget),
        to: makeLink(pages.currentMonthGroup.path, {
          budgetId: params.budgetId,
          categoryGroupId: params.categoryGroupId
        })
      }
    ]
  },
  {
    path: pages.group.path,
    breadcrumbs: params => [
      {
        label: pages.categories.title,
        to: makeLink(pages.categories.path, { budgetId: params.budgetId })
      }
    ]
  },
  {
    path: pages.category.path,
    breadcrumbs: (params, budget) => [
      {
        label: pages.categories.title,
        to: makeLink(pages.categories.path, { budgetId: params.budgetId })
      },
      {
        label: pages.group.title(params, budget),
        to: makeLink(pages.group.path, {
          budgetId: params.budgetId,
          categoryGroupId: params.categoryGroupId
        })
      }
    ]
  },
  {
    path: pages.payee.path,
    breadcrumbs: params => [
      {
        label: pages.payees.title,
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
