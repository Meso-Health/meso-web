import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ScrollLock from 'react-scrolllock';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import Box from 'components/box';

const Z_INDEX = 9000;

const fillScreen = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Overlay = styled.div`
  ${fillScreen}
  background: rgba(0, 0, 0, 0.3);
`;

const ModalContainer = styled.div`
  ${fillScreen}
  overflow-x: auto;
  overflow-y: scroll;
  z-index: ${Z_INDEX};
`;

const ModalTitle = styled.div`
  background: ${props => props.theme.colors.gray[1]};
  border-bottom: 1px ${props => props.theme.colors.gray[3]} solid;
  padding: ${props => props.theme.space[4]};
  font-weight: ${props => props.theme.font.weight.medium};
  text-align: center;
`;

const ModalCard = styled.div`
  position: relative;
  background: white;
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(136, 152, 170, 0.1),
    0 15px 35px 0 rgba(49, 49, 93, 0.1), 0 5px 15px 0 rgba(0, 0, 0, 0.13);
  top: 110px;
  margin: ${props => props.theme.space[5]} auto;
  overflow: hidden;
  width: 95%;
  max-width: 400px;
`;

const ModalFooter = styled.div`
  background: ${props => props.theme.colors.gray[1]};
  padding: ${props => props.theme.space[4]};
`;

class Modal extends Component {
  componentDidMount() {
    const { closeOnEscapeKey } = this.props;
    if (closeOnEscapeKey) {
      document.addEventListener('keydown', this.handleKeyDown);
    }
  }

  componentWillUnmount() {
    const { closeOnEscapeKey } = this.props;
    if (closeOnEscapeKey) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  handleKeyDown = (e) => {
    const { onRequestClose } = this.props;
    if (e.keyCode === 27) {
      onRequestClose();
    }
  };

  handleOverlayClick = () => {
    const { onRequestClose } = this.props;
    onRequestClose();
  };

  render() {
    const { title, children, footer } = this.props;

    return ReactDOM.createPortal(
      <div>
        <ScrollLock />
        <ModalContainer>
          <Overlay onClick={this.handleOverlayClick} />
          <ModalCard>
            {title.length > 0 && <ModalTitle><span>{title}</span></ModalTitle>}
            <Box padding={5}>{children}</Box>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </ModalCard>
        </ModalContainer>
      </div>,
      document.getElementById('root'),
    );
  }
}

export default Modal;

Modal.propTypes = {
  children: PropTypes.node,
  closeOnEscapeKey: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  footer: PropTypes.node,
};

Modal.defaultProps = {
  children: null,
  title: '',
  closeOnEscapeKey: true,
  footer: null,
};
