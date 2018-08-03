import React from "react";
import PropTypes from "prop-types";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import Layout from "./Layout";
import { PageTitle } from "./typeComponents";
import { PrimaryButton } from "./Button";
import SidebarMenu from "./SidebarMenu";
import BackLink from "./BackLink";

const PageWrapper = ({
  content,
  authorized,
  budgetId,
  budgetLoaded,
  title,
  actions,
  backLink,
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
              {backLink ? <BackLink /> : sidebarTrigger}
              <PageTitle style={{ flexGrow: 1 }}>
                {title}
              </PageTitle>
              {actions}
            </Layout.Header>
            <Layout.Body>{content()}</Layout.Body>
            {!authorized && (
              <div
                style={{
                  padding: "15px 20px",
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
                  borderTop: "1px solid #bbb"
                }}
              >
                Your authorization expired.
                <PrimaryButton onClick={onAuthorize}>Reauthorize</PrimaryButton>
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
  title: PropTypes.node.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  actions: PropTypes.node,
  backLink: PropTypes.bool
};

export default PageWrapper;
