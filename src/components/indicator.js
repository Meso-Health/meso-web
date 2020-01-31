import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const indicatorColors = {
  flag: 'red',
  inactive: 'yellow',
  active: 'green',
  unknown: 'gray',
};

const Indicator = styled.div`
  margin-left: 4px;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors[indicatorColors[props.type]][9]};
`;

export default Indicator;

Indicator.propTypes = {
  type: PropTypes.string.isRequired,
};
