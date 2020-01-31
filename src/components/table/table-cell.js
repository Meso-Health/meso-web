
import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';

const TextTableCell = ({
  color,
  style,
  colSpan,
  align,
  padding,
  children,
  fontFamily,
  fontWeight,
  fontSize,
  ...rest
}) => (
  <TableCell {...rest} style={{ padding: 8, height: 40, ...style }} colSpan={colSpan} align={align} padding={padding}>
    {children}
  </TableCell>
);

TextTableCell.propTypes = {
  align: PropTypes.string,
  children: PropTypes.node,
  color: PropTypes.string,
  colSpan: PropTypes.number,
  fontFamily: PropTypes.string,
  fontWeight: PropTypes.string,
  fontSize: PropTypes.number,
  padding: PropTypes.string,
  style: PropTypes.shape({}),
};

TextTableCell.defaultProps = {
  align: 'left',
  children: null,
  color: 'gray.9',
  colSpan: 1,
  fontFamily: 'sans',
  fontWeight: 'normal',
  fontSize: 3,
  padding: 'default',
  style: {},
};

export default TextTableCell;
