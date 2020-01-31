import AutosizeTextArea from 'react-textarea-autosize';
import styled from '@emotion/styled';

import inputStyles from './input-styles';

const TextArea = styled(AutosizeTextArea)`
  ${inputStyles}
  width: 100%;
  padding: 0.5rem 0.75rem;
  resize: none;

  &[disabled] {
    background: ${props => props.theme.colors.gray[0]};
    color: ${props => props.theme.colors.gray[6]};
  }
`;

export default TextArea;
