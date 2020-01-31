import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import styled from '@emotion/styled';

import { removeToast as removeToastAction } from 'store/toasts/toasts-actions';
import { toastSelector } from 'store/toasts/toasts-selectors';

import Box from 'components/box';
import Toast from './toast';

const ToastBox = styled.div`
  position: absolute;
  top: ${props => props.theme.layout.menuHeight}px;
  width: 100%;
`;

class ToastContainer extends Component {
  static mapDispatchToProps = dispatch => ({
    removeToast: id => dispatch(removeToastAction(id)),
  });

  static mapStateToProps = state => ({
    toasts: toastSelector(state),
  })

  render() {
    const { removeToast, toasts } = this.props;
    return (
      <ToastBox>
        <Box flex justifyContent="center">
          {toasts && toasts.map((toast) => {
            const { id } = toast;
            return (
              <Toast {...toast} key={id} removeToast={() => removeToast(id)} />
            );
          })}
        </Box>
      </ToastBox>
    );
  }
}

ToastContainer.propTypes = {
  removeToast: PropTypes.func.isRequired,
  toasts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default connect(
  ToastContainer.mapStateToProps,
  ToastContainer.mapDispatchToProps,
)(ToastContainer);
