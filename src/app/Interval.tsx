import React from 'react';
import styled from 'styled-components';
import Time from './Time';
import { CONFIG } from '../constant';

const Wrapper = styled.div`
  width: 48px;
  height: max-content;
`;

/**
 * sticky to the header with dateline
 */
const Box = styled.div`
  height: ${CONFIG.CSS.DATELINE_HEIGHT}px;
  background: ${CONFIG.CSS.GRAY_PRIMARY_COLOR};
  position: sticky;
  top: 0;
  z-index: 4;
`;

const Interval: React.FC = () => {
  return (
    <Wrapper data-idtf={CONFIG.DATA_IDTF.INTERVAL}>
      <Box />
      <Time />
    </Wrapper>
  );
};

export default Interval;
