import React, { useState } from 'react';
import styled from 'styled-components';
import Dateline from './Dateline';
import Grid from './Grid';

const Wrapper = styled.div`
  flex: 1;
  height: max-content;
`;

const Swipable: React.FC<{}> = () => {
  const [gridEl, setGridEl] = useState<HTMLDivElement | null>(null);

  return (
    <Wrapper data-idtf={'swipable'} ref={(ref) => setGridEl(ref)}>
      {gridEl && <Dateline height={gridEl.clientHeight} />}
      <Grid />
    </Wrapper>
  );
};

export default Swipable;
