import React from 'react';
import styled from 'styled-components';
import Time from './Time';

const Wrapper = styled.div`
  width: 48px;
  height: max-content;
`;

/**
 * sticky to the header with dateline
 */
const Box = styled.div`
  height: 60px;
  background: #f7f7f8;
  position: sticky;
  top: 0;
  z-index: 4;
`;

const Interval: React.FC<{}> = () => {
  return (
    <Wrapper data-idtf={'interval'}>
      <Box />
      <Time />
    </Wrapper>
  );
};

export default Interval;
