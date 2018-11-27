import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import EnsureBudgetLoaded from "./EnsureBudgetLoaded";
import { PrimaryButton } from "./Button";
import SidebarMenu from "./SidebarMenu";

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PageWrapper = ({
  authorized,
  budgetId,
  budgetLoaded,
  children,
  hasMultipleBudgets,
  location,
  onAuthorize,
  onRequestBudget
}) => (
  <EnsureBudgetLoaded
    budgetId={budgetId}
    budgetLoaded={budgetLoaded}
    onRequestBudget={onRequestBudget}
  >
    <SidebarMenu
      budgetId={budgetId}
      location={location}
      hasMultipleBudgets={hasMultipleBudgets}
    >
      {({ sidebarTrigger }) => (
        <Container>
          {children({ sidebarTrigger })}
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
  children: PropTypes.func.isRequired,
  hasMultipleBudgets: PropTypes.bool.isRequired,
  location: PropTypes.string.isRequired,
  onAuthorize: PropTypes.func.isRequired,
  onRequestBudget: PropTypes.func.isRequired
};

export default PageWrapper;
