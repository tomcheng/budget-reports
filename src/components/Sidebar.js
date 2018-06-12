import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const CANCEL_DISTANCE_ON_SCROLL = 20;
const DRAG_TOGGLE_DISTANCE = 30;

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
`;

const SidebarWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  transition: transform 0.2s ease-out;
  will-change: transform;
  overflow-y: auto;
  // box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.15);
  z-index: 2;
`;

const DragHandle = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 20px;
`;

const Overlay = styled.div`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease-out, visibility 0.2s ease-out;
  background-color: rgba(0, 0, 0, 0.4);
`;

class Sidebar extends Component {
  static propTypes = {
    backgroundColor: PropTypes.string,
    children: PropTypes.node.isRequired,
    sidebarWidth: PropTypes.number
  };

  static defaultProps = {
    backgroundColor: "#fff",
    sidebarWidth: 280
  };

  state = {
    isOpen: false,
    touchIdentifier: null,
    touchStartX: null,
    touchStartY: null,
    touchCurrentX: null,
    touchCurrentY: null,
    dragSupported: false
  };

  bodyEl = document.getElementsByTagName("body")[0];

  componentDidMount() {
    this.setState({
      dragSupported: typeof window === "object" && "ontouchstart" in window
    });
  }

  onTouchStart = evt => {
    // filter out if a user starts swiping with a second finger
    if (!this.isTouching()) {
      const touch = evt.targetTouches[0];
      this.setState({
        touchIdentifier: touch.identifier,
        touchStartX: touch.clientX,
        touchStartY: touch.clientY,
        touchCurrentX: touch.clientX,
        touchCurrentY: touch.clientY
      });
    }
  };

  onTouchMove = evt => {
    if (this.isTouching()) {
      for (let ind = 0; ind < evt.targetTouches.length; ind++) {
        // we only care about the finger that we are tracking
        if (evt.targetTouches[ind].identifier === this.state.touchIdentifier) {
          this.setState({
            touchCurrentX: evt.targetTouches[ind].clientX,
            touchCurrentY: evt.targetTouches[ind].clientY
          });
          break;
        }
      }
    }
  };

  onTouchEnd = () => {
    if (this.isTouching()) {
      const { sidebarWidth } = this.props;
      const { isOpen } = this.state;
      const touchWidth = this.touchSidebarWidth();

      if (
        (isOpen && touchWidth < sidebarWidth - DRAG_TOGGLE_DISTANCE) ||
        (!isOpen && touchWidth > DRAG_TOGGLE_DISTANCE)
      ) {
        this.toggleOpen(!isOpen);
      }

      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchStartY: null,
        touchCurrentX: null,
        touchCurrentY: null
      });
    }
  };

  // This logic helps us prevents the user from sliding the sidebar horizontally
  // while scrolling the sidebar vertically. When a scroll event comes in, we're
  // cancelling the ongoing gesture if it did not move horizontally much.
  onScroll = () => {
    if (this.isTouching() && this.inCancelDistanceOnScroll()) {
      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchStartY: null,
        touchCurrentX: null,
        touchCurrentY: null
      });
    }
  };

  inCancelDistanceOnScroll = () => {
    const { touchStartX, touchCurrentX } = this.state;

    return Math.abs(touchStartX - touchCurrentX) < CANCEL_DISTANCE_ON_SCROLL;
  };

  isTouching = () => this.state.touchIdentifier !== null;

  overlayClicked = () => {
    if (this.state.isOpen) {
      this.toggleOpen(false);
    }
  };

  toggleOpen = open => {
    this.bodyEl.style.overflow = open ? "hidden" : "auto";
    this.setState({ isOpen: open });
  };

  // calculate the sidebarWidth based on current touch info
  touchSidebarWidth = () => {
    // if the sidebar is open and start point of drag is inside the sidebar
    // we will only drag the distance they moved their finger
    // otherwise we will move the sidebar to be below the finger.
    if (this.state.isOpen && this.state.touchStartX < this.props.sidebarWidth) {
      if (this.state.touchCurrentX > this.state.touchStartX) {
        return this.props.sidebarWidth;
      }
      return (
        this.props.sidebarWidth -
        this.state.touchStartX +
        this.state.touchCurrentX
      );
    }
    return Math.min(this.state.touchCurrentX, this.props.sidebarWidth);
  };

  render() {
    const { backgroundColor, sidebarWidth } = this.props;
    const { isOpen } = this.state;

    const sidebarStyle = {
      backgroundColor,
      width: sidebarWidth
    };
    const overlayStyle = {};
    const useTouch = this.state.dragSupported;
    const isTouching = this.isTouching();
    const sidebarProps = {};

    // sidebarStyle right/left
    sidebarStyle.transform = "translateX(-100%)";
    sidebarStyle.WebkitTransform = "translateX(-100%)";

    if (isTouching) {
      const percentage = this.touchSidebarWidth() / this.props.sidebarWidth;

      // slide open to what we dragged
      sidebarStyle.transform = `translateX(-${(1 - percentage) * 100}%)`;
      sidebarStyle.WebkitTransform = `translateX(-${(1 - percentage) * 100}%)`;

      // fade overlay to match distance of drag
      overlayStyle.opacity = percentage;
      overlayStyle.visibility = "visible";
    } else if (isOpen) {
      // slide open sidebar
      sidebarStyle.transform = `translateX(0%)`;
      sidebarStyle.WebkitTransform = `translateX(0%)`;

      // show overlay
      overlayStyle.opacity = 1;
      overlayStyle.visibility = "visible";
    }

    if (isTouching) {
      sidebarStyle.transition = "none";
      sidebarStyle.WebkitTransition = "none";
      overlayStyle.transition = "none";
    }

    if (useTouch && isOpen) {
      sidebarProps.onTouchStart = this.onTouchStart;
      sidebarProps.onTouchMove = this.onTouchMove;
      sidebarProps.onTouchEnd = this.onTouchEnd;
      sidebarProps.onTouchCancel = this.onTouchEnd;
      sidebarProps.onScroll = this.onScroll;
    }

    return (
      <Container>
        <SidebarWrapper {...sidebarProps} style={sidebarStyle}>
          {this.props.children}
        </SidebarWrapper>
        <Overlay
          style={overlayStyle}
          role="presentation"
          tabIndex="0"
          onClick={this.overlayClicked}
        />
        {useTouch &&
        !isOpen && (
          <DragHandle
            onTouchStart={this.onTouchStart}
            onTouchMove={this.onTouchMove}
            onTouchEnd={this.onTouchEnd}
            onTouchCancel={this.onTouchEnd}
          />
        )}
      </Container>
    );
  }
}

export default Sidebar;