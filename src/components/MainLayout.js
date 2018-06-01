import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { PageTitle } from "./typeComponents";
import PageActions from "./PageActions";

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #bbb;
  white-space: pre;
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const MainLayout = ({ title, onRefreshBudget, budgetId, children }) => (
  <Container>
    <Header>
      <PageTitle>{title}</PageTitle>
      <PageActions onRefreshBudget={onRefreshBudget} budgetId={budgetId} />
    </Header>
    <Content>{children}</Content>
  </Container>
);

MainLayout.propTypes = {
  budgetId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  onRefreshBudget: PropTypes.func.isRequired
};

export default MainLayout;
