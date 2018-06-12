import React from "react";
import PropTypes from "prop-types";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import Layout from "./Layout";
import { PageTitle } from "./typeComponents";
import SidebarMenu from "./SidebarMenu";

const PageWrapper = ({
  content,
  budgetId,
  budgetLoaded,
  title,
  actions,
  onRequestBudget,
  onRefreshBudget
}) => (
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={budgetLoaded}
    onRequestBudget={onRequestBudget}
  >
    {() => (
      <SidebarMenu budgetId={budgetId} onRefreshBudget={onRefreshBudget}>
        {({ sidebarTrigger }) => (
          <Layout>
            <Layout.Header flushLeft>
              {sidebarTrigger}
              <PageTitle style={{ flexGrow: 1 }}>{title}</PageTitle>
              {actions}
            </Layout.Header>
            <Layout.Body>{content()}</Layout.Body>
          </Layout>
        )}
      </SidebarMenu>
    )}
  </EnsureBudgetLoaded>
);

PageWrapper.propTypes = {
  budgetId: PropTypes.string.isRequired,
  budgetLoaded: PropTypes.bool.isRequired,
  content: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  actions: PropTypes.node
};

export default PageWrapper;
