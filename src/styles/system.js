import PropTypes from 'prop-types';
import theme from './theme';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const getNumericStyleValue = val => theme.space[val] || val;

const colorKeys = Object.keys(theme.colors);
const getColor = (input) => {
  if (typeof input === 'undefined') {
    return null; // TODO check returning null
  }

  if (input.includes('#') || input.includes('rgb') || input.includes('hsb')) {
    return input;
  }

  const parts = input.split('.');
  const color = parts[0];
  const index = parts[1];

  if (process.env.NODE_ENV !== 'production') {
    if (parts.length !== 2) {
      throw new Error('Can only access colors ');
    }

    if (!colorKeys.includes(color)) {
      throw new Error(`'${color}' is not a valid theme color`);
    }

    if (!theme.colors[color][index]) {
      throw new Error(`'${index}' is not a valid variation of ${color}`);
    }
  }

  return theme.colors[color][index];
};

const FlexAlignmentProp = PropTypes.oneOf(['center', 'flex-start', 'flex-end', 'space-around', 'space-between', 'stretch']);
const SpacingProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const flexbox = props => ({
  display: props.flex ? 'flex' : undefined,
  flexGrow: props.flexGrow,
  flexShrink: props.flexShrink,
  flexBasis: props.flexBasis,
  flexDirection: props.flexDirection,
  justifyContent: props.justifyContent,
  alignItems: props.alignItems,
});

flexbox.propTypes = {
  alignItems: FlexAlignmentProp,
  flex: PropTypes.bool,
  flexBasis: PropTypes.string,
  flexDirection: PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse']),
  flexGrow: PropTypes.string,
  flexShrink: PropTypes.string,
  justifyContent: FlexAlignmentProp,
};

export const spacing = props => ({
  paddingBottom: getNumericStyleValue(props.paddingBottom || props.paddingVertical || props.padding),
  paddingLeft: getNumericStyleValue(props.paddingLeft || props.paddingHorizontal || props.padding),
  paddingRight: getNumericStyleValue(props.paddingRight || props.paddingHorizontal || props.padding),
  paddingTop: getNumericStyleValue(props.paddingTop || props.paddingVertical || props.padding),

  marginBottom: getNumericStyleValue(props.marginBottom || props.marginVertical || props.margin),
  marginLeft: getNumericStyleValue(props.marginLeft || props.marginHorizontal || props.margin),
  marginRight: getNumericStyleValue(props.marginRight || props.marginHorizontal || props.margin),
  marginTop: getNumericStyleValue(props.marginTop || props.marginVertical || props.margin),
});

spacing.propTypes = {
  margin: SpacingProp,
  marginBottom: SpacingProp,
  marginHorizontal: SpacingProp,
  marginLeft: SpacingProp,
  marginRight: SpacingProp,
  marginTop: SpacingProp,
  marginVertical: SpacingProp,
  padding: SpacingProp,
  paddingBottom: SpacingProp,
  paddingHorizontal: SpacingProp,
  paddingLeft: SpacingProp,
  paddingRight: SpacingProp,
  paddingTop: SpacingProp,
  paddingVertical: SpacingProp,
};

export const size = props => ({
  maxWidth: props.maxWidth,
  width: props.width || props.size,
  height: props.height || props.size,
});

size.propTypes = {
  height: SpacingProp,
  maxWidth: SpacingProp,
  width: SpacingProp,
};

export const typography = props => ({
  color: getColor(props.color),
  fontFamily: theme.font.family[props.fontFamily],
  fontSize: theme.font.size[props.fontSize],
  fontWeight: theme.font.weight[props.fontWeight],
  lineHeight: theme.font.lineHeight[props.lineHeight],
  textAlign: props.textAlign,
  textRendering: props.textRendering,
  verticalAlign: props.verticalAlign,
});

typography.propTypes = {
  color: PropTypes.string,
  fontFamily: PropTypes.oneOf(Object.keys(theme.font.family)),
  fontSize: PropTypes.oneOf(Object.keys(theme.font.size).map(Number)),
  fontWeight: PropTypes.oneOf(Object.keys(theme.font.weight)),
  lineHeight: PropTypes.oneOf(Object.keys(theme.font.lineHeight)),
  textAlign: PropTypes.oneOf(['left', 'center', 'right']),
};
