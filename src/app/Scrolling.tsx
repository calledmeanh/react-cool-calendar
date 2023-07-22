import React from 'react';
import styled from 'styled-components';
import { Flex } from './common';
import Time from './Time';
import Swipable from './Swipable';

const Wrapper = styled(Flex)`
  width: 100%;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
`;

const Scrolling: React.FC<{}> = () => {
  return (
    <Wrapper data-idtf={'scrolling'}>
      <Time />
      <Swipable />
    </Wrapper>
  );
};

export default Scrolling;
