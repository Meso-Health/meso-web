import styled from '@emotion/styled';
import { css } from '@emotion/core';

import { flexbox, size, spacing, typography } from 'styles/system';

const Box = styled.div`
  ${flexbox}
  ${size}
  ${spacing}
  ${typography}

  ${props => css`
    ${{
    border: props.border,
    borderRadius: props.borderRadius,
    borderTop: props.borderTop,
    borderBottom: props.borderBottom,
  }}`
}`;

export default Box;

Box.propTypes = {
  ...flexbox.propTypes,
  ...spacing.propTypes,
  ...typography.propTypes,
};

Box.displayName = 'Box';
