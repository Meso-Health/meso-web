import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const alertColors = {
  error: 'red',
  success: 'green',
  warning: 'yellow',
  info: 'gray',
};

const Alert = styled.div`
  padding: ${props => props.theme.space[4]};
  border-radius: 3px;
  font-size: ${props => props.theme.font.size[2]};
  line-height: 1.7;
  text-align: center;

  ${props => props.theme.colors[alertColors[props.type]] && css`
    color: ${props.theme.colors[alertColors[props.type]][props.type === 'error' ? 10 : 9]};
    background-color: ${props.theme.colors[alertColors[props.type]][1]};
    border: 1px ${props.theme.colors[alertColors[props.type]][3]} solid;
  `}
`;

Alert.propTypes = {
  type: PropTypes.string,
};

Alert.defaultProps = {
  type: 'error',
};

export default Alert;
