import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import { PageTitle } from "./typeComponents";
import { PrimaryButton } from "./Button";
import SidebarMenu from "./SidebarMenu";
import BackLink from "./BackLink";
import HeaderMenu from "./HeaderMenu";

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
  justify-content: space-between;
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
  backLink,
  headerMenu,
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
              {backLink ? <BackLink /> : sidebarTrigger}
              <PageTitle style={{ flexGrow: 1 }}>{title}</PageTitle>
              {actions}
            </HeaderTop>
            {headerMenu && <HeaderMenu {...headerMenu} />}
          </Header>
          <Body>{content()}</Body>
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
  authorized: PropTypes.bool.isRequired,
  budgetId: PropTypes.string.isRequired,
  budgetLoaded: PropTypes.bool.isRequired,
  content: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired,
  actions: PropTypes.node,
  backLink: PropTypes.bool,
  headerMenu: PropTypes.object
};

export default PageWrapper;
