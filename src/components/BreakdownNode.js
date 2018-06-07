import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import ListItem from "./ListItem";
import { SecondaryText } from "./typeComponents";
import AmountWithPercentage from "./AmountWithPercentage";
import NameWithExpandedIndicator from "./NameWithExpandedIndicator";

class BreakdownNode extends Component {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    isTopLevel: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ),
  };

  state = { expanded: false };

  handleToggleExpand = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const { name, amount, total, nodes, isTopLevel } = this.props;
    const { expanded } = this.state;
    const hasChildNodes = !!nodes && nodes.length > 0;

    return (
      <Container hasChildNodes={hasChildNodes} isTopLevel={isTopLevel}>
        {hasChildNodes ? (
          <ToggleNode
            name={name}
            amount={amount}
            total={total}
            expanded={expanded}
            onToggle={this.handleToggleExpand}
          />
        ) : (
          <LeafNode name={name} amount={amount} total={total} />
        )}

        {hasChildNodes && (
          <AnimateHeight isExpanded={expanded}>
            <div style={{ paddingLeft: 18 }}>
              {nodes.map(node => (
                <BreakdownNode
                  {...node}
                  key={node.id}
                  isTopLevel={false}
                  total={total}
                />
              ))}
            </div>
          </AnimateHeight>
        )}
      </Container>
    );
  }
}

const NodeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  user-select: none;
`;

const ToggleNode = ({ onToggle, expanded, name, amount, total }) => (
  <NodeWrapper onClick={onToggle}>
    <NameWithExpandedIndicator name={name} expanded={expanded} />
    <AmountWithPercentage amount={amount} total={total} faded={expanded} />
  </NodeWrapper>
);

const LeafNode = ({ name, amount, total }) => (
  <NodeWrapper>
    <SecondaryText>{name}</SecondaryText>
    <AmountWithPercentage amount={amount} total={total} />
  </NodeWrapper>
);

const Container = ({ isTopLevel, hasChildNodes, children }) =>
  isTopLevel ? (
    <ListItem style={{ display: "block", padding: 0 }}>{children}</ListItem>
  ) : (
    children
  );

export default BreakdownNode;
