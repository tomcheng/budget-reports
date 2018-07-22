import React from "react";
import PropTypes from "prop-types";
import { plotBandColor } from "../styleVariables";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import Layout from "./Layout";
import { PageTitle } from "./typeComponents";
import SidebarMenu from "./SidebarMenu";

const PageWrapper = ({
  content,
  authorized,
  budgetId,
  budgetLoaded,
  title,
  actions,
  onAuthorize,
  onRequestBudget
}) => (
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={budgetLoaded}
    onRequestBudget={onRequestBudget}
  >
    {() => (
      <SidebarMenu budgetId={budgetId}>
        {({ sidebarTrigger }) => (
          <Layout>
            <Layout.Header flushLeft>
              {sidebarTrigger}
              <PageTitle style={{ flexGrow: 1 }}>{title}</PageTitle>
              {actions}
            </Layout.Header>
            <Layout.Body>{content()}</Layout.Body>
            {!authorized && (
              <div
                style={{
                  padding: 20,
                  backgroundColor: plotBandColor,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0
                }}
              >
                Your authorization expired.
                <button onClick={onAuthorize}>Reauthorize</button>
              </div>
            )}
          </Layout>
        )}
      </SidebarMenu>
    )}
  </EnsureBudgetLoaded>
);

PageWrapper.propTypes = {
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  budgetLoaded: PropTypes.bool.isRequired,
  content: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  actions: PropTypes.node
};

export default PageWrapper;
