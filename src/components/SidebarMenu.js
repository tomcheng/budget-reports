import React, { Component } from "react";
import PropTypes from "prop-types";
import Sidebar from "react-sidebar";
import { iconWidth } from "../styleVariables";
import Icon from "./Icon";
import SidebarMenuContent from "./SidebarMenuContent";

class SidebarMenu extends Component {
  static propTypes = {
    budgetId: PropTypes.string.isRequired,
    children: PropTypes.func.isRequired
  };

  state = { open: false };

  handleSetOpen = open => {
    this.setState({ open });
  };

  handleTriggerClick = () => {
    this.setState({ open: true });
  };

  handleCloseSidebar = () => {
    this.setState({ open: false });
  };

  render() {
    const { budgetId, children } = this.props;
    const { open } = this.state;

    return (
      <Sidebar
        sidebar={
          <SidebarMenuContent
            budgetId={budgetId}
            onCloseSidebar={this.handleCloseSidebar}
          />
        }
        open={open}
        onSetOpen={this.handleSetOpen}
        styles={{
          sidebar: {
            backgroundColor: "#fff",
            width: 280
          }
        }}
      >
        {children({
          sidebarTrigger: <Trigger onClick={this.handleTriggerClick} />
        })}
      </Sidebar>
    );
  }
}

const Trigger = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      alignSelf: "stretch",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: iconWidth
    }}
  >
    <Icon icon="bars" />
  </div>
);

export default SidebarMenu;
