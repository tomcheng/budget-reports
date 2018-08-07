import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import values from "lodash/fp/values";
import { groupBy } from "../optimized";
import pages, { makeLink } from "../pages";
import CategoriesState from "./CategoriesState";

const categoryPath = "/budgets/:budgetId/groups/:categoryGroupId";
const groupedPages = groupBy(
  page => (page.path.startsWith(categoryPath) ? "categoryPages" : "otherPages")
)(values(pages));

const PageContent = props =>
  props.budget && (
    <Switch>
      <Route
        path={categoryPath}
        render={({ match }) => (
          <CategoriesState key={match.params.categoryGroupId}>
            {({ selectedMonth, onSelectMonth }) => (
              <Switch>
                {groupedPages.categoryPages.map(
                  ({ path, props: propsFunction, Component }) => (
                    <Route
                      key={path}
                      path={path}
                      exact
                      render={({ match }) => (
                        <Component
                          {...propsFunction(props, match.params)}
                          selectedMonth={selectedMonth}
                          onSelectMonth={onSelectMonth}
                        />
                      )}
                    />
                  )
                )}
              </Switch>
            )}
          </CategoriesState>
        )}
      />
      {groupedPages.otherPages.map(
        ({ path, props: propsFunction, Component }) => (
          <Route
            key={path}
            path={path}
            exact
            render={({ match }) => (
              <Component {...propsFunction(props, match.params)} />
            )}
          />
        )
      )}
      <Route
        render={() => (
          <div style={{ padding: 20 }}>
            <Link
              to={makeLink(pages.currentMonth.path, {
                budgetId: props.budget.id
              })}
            >
              Return to {pages.currentMonth.title}
            </Link>
          </div>
        )}
      />
    </Switch>
  );

PageContent.propTypes = {
  currentMonth: PropTypes.string.isRequired,
  investmentAccounts: PropTypes.object.isRequired,
  mortgageAccounts: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  onUpdateAccounts: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default PageContent;
