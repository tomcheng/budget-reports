import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment/moment";
import { getLastUpdated } from "../uiRepo";
import { PageTitle, MinorText } from "./typeComponents";

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
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const MainLayout = ({ title, onRefreshBudget, budgetId, children }) => (
  <Container>
    <Header>
      <PageTitle>{title}</PageTitle>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={() => {
            onRefreshBudget(budgetId);
          }}
        >
          Refresh
        </button>
        <MinorText>
          Updated {moment(getLastUpdated(budgetId) || undefined).fromNow()}
        </MinorText>
      </div>
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
