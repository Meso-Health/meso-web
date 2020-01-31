import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

/**
 * Tab container
 */

function findTabIndexByKey(children, key) {
  const arr = React.Children.toArray(children);
  const result = arr.findIndex(child => child.props.tabKey === key);
  return result === -1 ? null : result;
}

const Tabs = ({ activeTabKey, children }) => {
  const activeTabIndex = findTabIndexByKey(children, activeTabKey) || 0;
  const activeTabContent = children[activeTabIndex].props.children;

  return (
    <TabContainer>
      {activeTabContent}
    </TabContainer>
  );
};

Tabs.propTypes = {
  activeTabKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Tab
 */

const Tab = () => undefined;

Tab.propTypes = {
  children: PropTypes.node.isRequired,
  tabKey: PropTypes.string.isRequired,
};

/**
 * Tab link container
 */

const TabLinks = ({ activeTabKey, onTabLinkClick, children }) => (
  <TabBar>
    {React.Children.map(children, child => (
      React.cloneElement(child, {
        active: activeTabKey === child.props.tabKey,
        onClick: () => onTabLinkClick(child.props.tabKey),
        key: child.props.tabKey,
      })
    ))}
  </TabBar>
);

TabLinks.propTypes = {
  activeTabKey: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onTabLinkClick: PropTypes.func.isRequired,
};

/**
 * Tab link
 */

const TabLink = ({ children, ...props }) => (
  <TabLinkContainer role="tab">
    {React.cloneElement(React.Children.only(children), props)}
  </TabLinkContainer>
);

TabLink.propTypes = {
  children: PropTypes.node.isRequired,
  tabKey: PropTypes.string.isRequired,
};

/**
 * Styles
 */

const TabContainer = styled.div`
`;

const TabBar = styled.div`
  display: flex;
`;

const TabLinkContainer = styled.a`
  cursor: pointer;
  margin-right: 0.5rem;
`;

/**
 * Exports
 */

export {
  Tabs,
  Tab,
  TabLinks,
  TabLink,
};
