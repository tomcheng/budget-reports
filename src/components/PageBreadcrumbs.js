import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, Route, Switch } from "react-router-dom";
import values from "lodash/fp/values";
import pages, { makeLink } from "../pages";
import { MinorText } from "./typeComponents";
import Icon from "./Icon";

const routes = values(pages)
  .filter(page => !!page.breadcrumbs)
  .map(page => ({
    path: page.path,
    breadcrumbs: page.breadcrumbs.map(pageKey => ({
      title: pages[pageKey].title,
      path: pages[pageKey].path
    }))
  }));

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
              {breadcrumbs.map(({ title, path }, index) => (
                <Fragment key={path}>
                  <Link
                    to={makeLink(path, props.match.params)}
                    style={{
                      paddingBottom: 8,
                      display: "inline-block"
                    }}
                  >
                    {typeof title === "function"
                      ? title(props.match.params, budget)
                      : title}
                  </Link>
                  {index !== breadcrumbs.length - 1 && (
                    <Icon
                      icon="chevron-right"
                      style={{ padding: "0 5px", fontSize: 8 }}
                    />
                  )}
                </Fragment>
              ))}
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
