import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { PageTitle } from "./typeComponents";
import Scroller from "./Scroller";
import PageBreadcrumbs from "./PageBreadcrumbs";
import PageActions from "./PageActions";

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 60px;
  padding-left: 0;
  padding-right: 20px;
  background-color: #fff;
  background-clip: padding-box;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  white-space: pre;
  user-select: none;
`;

const Body = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const PageLayout = ({
  sidebarTrigger, // from PageWrapper
  historyAction, // from PageWrapper
  location, // from PageWrapper
  budget,
  title,
  breadcrumbs,
  fixedContent,
  content
}) => (
  <Fragment>
    <Header>
      {sidebarTrigger}
      <div style={{ flexGrow: 1 }}>
        <PageBreadcrumbs budget={budget} />
        <PageTitle style={{ lineHeight: 1 }}>{title}</PageTitle>
      </div>
      <PageActions />
    </Header>
    {fixedContent}
    <Scroller action={historyAction} location={location}>
      {({ ref }) => <Body ref={ref}>{content}</Body>}
    </Scroller>
  </Fragment>
);

PageLayout.propTypes = {
  sidebarTrigger: PropTypes.node.isRequired,
  historyAction: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  budget: PropTypes.object,
  breadcrumbs: PropTypes.node,
  fixedContent: PropTypes.node,
  content: PropTypes.node
};

export default PageLayout;
