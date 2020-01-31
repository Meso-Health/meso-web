import styled from '@emotion/styled';

const Container = styled.div`
  max-width: ${props => props.theme.layout.containerMaxWidth}px;
  min-width: ${props => props.theme.layout.containerMinWidth}px;
  margin-left: auto;
  margin-right: auto;
`;

export default Container;
