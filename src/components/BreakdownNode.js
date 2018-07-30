import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import AnimateHeight from "react-animate-height-auto";
import { SecondaryText } from "./typeComponents";
import Amount from "./Amount";
import ListItem from "./ListItem";
import Icon from "./Icon";

const INDENTATION = 18;

class BreakdownNode extends Component {
  static propTypes = {
    amount: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    isTopLevel: PropTypes.bool.isRequired,
    name: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    infoRenderer: PropTypes.func,
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    )
  };

  state = { expanded: false };

  handleToggleExpand = () => {
    this.setState(state => ({ ...state, expanded: !state.expanded }));
  };

  render() {
    const { name, id, amount, nodes, isTopLevel, infoRenderer } = this.props;
    const { expanded } = this.state;
    const hasChildNodes = !!nodes && nodes.length > 0;

    return (
      <Container hasChildNodes={hasChildNodes} isTopLevel={isTopLevel}>
        {hasChildNodes ? (
          <ToggleNode
            id={id}
            name={name}
            amount={amount}
            expanded={expanded}
            onToggle={this.handleToggleExpand}
            infoRenderer={infoRenderer}
          />
        ) : (
          <LeafNode
            id={id}
            name={name}
            amount={amount}
            infoRenderer={infoRenderer}
          />
        )}

        {hasChildNodes && (
          <AnimateHeight isExpanded={expanded}>
            <Nodes nodes={nodes} infoRenderer={infoRenderer} />
          </AnimateHeight>
        )}
      </Container>
    );
  }
}

class Nodes extends PureComponent {
  render() {
    const { nodes, infoRenderer } = this.props;
    return (
      <div style={{ paddingLeft: INDENTATION }}>
        {nodes.map(node => (
          <BreakdownNode
            {...node}
            key={node.id}
            isTopLevel={false}
            infoRenderer={infoRenderer}
          />
        ))}
      </div>
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

const IconWrapper = styled.div`
  box-sizing: border-box;
  padding-left: 3px;
  width: ${INDENTATION}px;
  font-weight: 400;
  color: #888;
  font-size: 10px;
`;

const ToggleNode = ({ expanded, name, id, amount, infoRenderer, onToggle }) => (
  <NodeWrapper onClick={onToggle}>
    <SecondaryText
      style={{ whiteSpace: "pre", display: "flex", alignItems: "center" }}
    >
      <IconWrapper>
        <Icon icon="chevron-right" transform={{ rotate: expanded ? 90 : 0 }} />
      </IconWrapper>
      {typeof name === "function" ? name({ expanded }) : name}
    </SecondaryText>
    <SecondaryText style={{ display: "flex", opacity: expanded ? 0.3 : 1 }}>
      <Amount amount={amount} />
      {infoRenderer && infoRenderer({ amount, id })}
    </SecondaryText>
  </NodeWrapper>
);

const LeafNode = ({ name, id, amount, infoRenderer }) => (
  <NodeWrapper>
    <SecondaryText>{name}</SecondaryText>
    <SecondaryText style={{ display: "flex" }}>
      <Amount amount={amount} />
      {infoRenderer && infoRenderer({ amount, id })}
    </SecondaryText>
  </NodeWrapper>
);

const Container = ({ isTopLevel, hasChildNodes, children }) =>
  isTopLevel ? (
    <ListItem style={{ display: "block", padding: 0 }}>{children}</ListItem>
  ) : (
    children
  );

export default BreakdownNode;
