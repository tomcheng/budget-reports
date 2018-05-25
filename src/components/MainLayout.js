import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment/moment";
import { getLastUpdated } from "../uiRepo";

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

const UpdatedText = styled.div`
  color: #888;
  font-size: 11px;
  line-height: 18px;
  margin-top: 2px;
`;

const Content = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const MainLayout = ({ title, onRefreshBudget, budgetId, children }) => (
  <Container>
    <Header>
      <div style={{ fontWeight: 600 }}>{title}</div>
      <div style={{ textAlign: "right" }}>
        <button
          onClick={() => {
            onRefreshBudget(budgetId);
          }}
        >
          Refresh
        </button>
        <UpdatedText>
          Updated {moment(getLastUpdated(budgetId) || undefined).fromNow()}
        </UpdatedText>
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
