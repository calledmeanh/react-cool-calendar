import React from 'react';
import styled from 'styled-components';
import { CONFIG } from '../constant';
import { Flex } from './common';
import Swipable from './Swipable';
import Interval from './Interval';

const Wrapper = styled(Flex)`
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

const Scrolling: React.FC = () => {
  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.SCROLLING}>
      <Interval />
      <Swipable />
    </Wrapper>
  );
};

export default Scrolling;
