import React from 'react';
import styled from 'styled-components';
import { Box, Flex } from './common';
import Scrolling from './Scrolling';

const Wrapper = styled(Flex)`
  flex: 1;
  width: 100%;
  overflow: auto;
  position: relative;
`;

const Content: React.FC<{}> = () => {
  return (
    <Wrapper data-idtf={'content'} $dir={'column'}>
      <Box data-idtf={'box'} $pos={[0, 0]} />
      <Scrolling />
    </Wrapper>
  );
};

export default Content;
