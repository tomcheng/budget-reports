import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import { PageTitle } from "./typeComponents";
import { PrimaryButton } from "./Button";
import SidebarMenu from "./SidebarMenu";

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  flex-shrink: 0;
  background-color: #fff;
  border-bottom: 1px solid #ccc;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 0;
  padding-right: 20px;
  white-space: pre;
`;

const Body = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const PageWrapper = ({
  content,
  authorized,
  budgetId,
  budgetLoaded,
  title,
  actions,
  breadcrumbs,
  onAuthorize,
  onRequestBudget
}) => (
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={budgetLoaded}
    onRequestBudget={onRequestBudget}
  >
    <SidebarMenu budgetId={budgetId}>
      {({ sidebarTrigger }) => (
        <Container>
          <Header flushLeft>
            <HeaderTop>
              {sidebarTrigger}
              <div style={{ flexGrow: 1 }}>
                {breadcrumbs}
                <PageTitle style={{ lineHeight: 1 }}>{title}</PageTitle>
              </div>
              {actions}
            </HeaderTop>
          </Header>
          <Body>{content}</Body>
          {!authorized && (
            <div
              style={{
                padding: "15px 20px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                borderTop: "1px solid #ccc"
              }}
            >
              Your authorization expired.
              <PrimaryButton onClick={onAuthorize}>Reauthorize</PrimaryButton>
            </div>
          )}
        </Container>
      )}
    </SidebarMenu>
  </EnsureBudgetLoaded>
);

PageWrapper.propTypes = {
  actions: PropTypes.node.isRequired,
  authorized: PropTypes.bool.isRequired,
  breadcrumbs: PropTypes.node.isRequired,
  budgetId: PropTypes.string.isRequired,
  budgetLoaded: PropTypes.bool.isRequired,
  content: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired
};

export default PageWrapper;
