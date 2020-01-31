
import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import { Text } from 'components/text';

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
  forwardRef,
  ...rest
}) => (
  <TableCell
    ref={forwardRef}
    {...rest}
    style={{ padding: 8, height: 40, ...style }}
    colSpan={colSpan}
    align={align}
    padding={padding}
  >
    <Text color={color} fontWeight={fontWeight} fontSize={fontSize} fontFamily={fontFamily}>{children}</Text>
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
  forwardRef: PropTypes.func,
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
  forwardRef: () => {},
};

export default TextTableCell;
