import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const MetadataList = ({ children }) => (
  <MetadataListContainer>
    {children}
  </MetadataListContainer>
);

MetadataList.propTypes = {
  children: PropTypes.node.isRequired,
};

const MetadataListContainer = styled.dl`
  border: 1px #f2f2f2 solid;
  border-radius: 3px;
  padding-left: ${props => props.theme.space[4]};
  padding-right: ${props => props.theme.space[4]};
  line-height: 1.2;
`;

export default MetadataList;
