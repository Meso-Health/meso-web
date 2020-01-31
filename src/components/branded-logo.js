import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const ScaledImage = styled.img`
  max-height: ${props => props.height}px;
  padding: 4px 8px;
  background: white;
`;

const BrandedLogo = ({ url, height }) => (
  <ScaledImage height={height} src={url} alt="logo" />
);

BrandedLogo.propTypes = {
  height: PropTypes.number.isRequired,
  url: PropTypes.string.isRequired,
};

export default BrandedLogo;
