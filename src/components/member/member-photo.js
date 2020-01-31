import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { isNil } from 'lodash/fp';

import Icon from 'components/icon';

/**
 * Component
 */

function MemberPhoto({ src, name, small, ...props }) {
  return (
    <PhotoContainer small={small} {...props}>
      {isNil(src) ? (
        <PhotoFallback small={small} />
      ) : (
        <Photo src={src} alt={name} linkPhoto={!small} />
      )}
    </PhotoContainer>
  );
}

MemberPhoto.propTypes = {
  name: PropTypes.string,
  small: PropTypes.bool,
  src: PropTypes.string,
};

MemberPhoto.defaultProps = {
  src: undefined,
  name: undefined,
  small: false,
};

/**
 * Styles
 */

const PhotoContainer = styled.div`
  position: relative;
  background: ${props => props.theme.colors.gray[0]};
  border-radius: 3px;
  ${props => (props.small ? css`
    width: 32px;
    height: 32px;
  ` : css`
    width: 128px;
    height: 128px;
  `)}
  overflow: hidden;
`;

const StyledPhoto = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Photo = ({ src, alt, linkPhoto, ...props }) => (
  linkPhoto ? (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
    >
      <StyledPhoto src={src} alt={alt} {...props} />
    </a>
  ) : (
    <StyledPhoto src={src} alt={alt} {...props} />
  )
);

Photo.propTypes = {
  alt: PropTypes.string.isRequired,
  linkPhoto: PropTypes.bool.isRequired,
  src: PropTypes.string.isRequired,
};

const PhotoFallbackContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.theme.colors.blue[4]};
  background: ${props => props.theme.colors.blue[2]};
  width: 100%;
  height: 100%;
`;

const PhotoFallback = ({ small }) => (
  <PhotoFallbackContainer>
    <Icon name="user" size={small ? 16 : 36} />
  </PhotoFallbackContainer>
);

PhotoFallback.propTypes = {
  small: PropTypes.bool,
};

PhotoFallback.defaultProps = {
  small: false,
};


/**
 * Exports
 */

export default MemberPhoto;
