import React from "react";
import PropTypes from "prop-types";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import Layout from "./Layout";
import { PageTitle } from "./typeComponents";
import PageActions from "./PageActions";
import SidebarMenu from "./SidebarMenu";

const PageWrapper = ({
  children,
  budgetId,
  budget,
  title,
  onRequestBudget,
  onRefreshBudget
}) => (
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={!!budget}
    onRequestBudget={onRequestBudget}
  >
    {() => (
      <SidebarMenu budgetId={budgetId}>
        {({ sidebarTrigger }) => (
          <Layout>
            <Layout.Header flushLeft flushRight>
              {sidebarTrigger}
              <PageTitle style={{ flexGrow: 1 }}>{title}</PageTitle>
              <PageActions
                budgetId={budgetId}
                onRefreshBudget={onRefreshBudget}
              />
            </Layout.Header>
            <Layout.Body>{children}</Layout.Body>
          </Layout>
        )}
      </SidebarMenu>
    )}
  </EnsureBudgetLoaded>
);

PageWrapper.propTypes = {
  budgetId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  budget: PropTypes.object
};

export default PageWrapper;
