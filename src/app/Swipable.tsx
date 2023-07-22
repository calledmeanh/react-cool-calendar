import React from 'react';
import styled from 'styled-components';
import Timeline from './Timeline';
import Grid from './Grid';

const Wrapper = styled.div`
  flex: 1;
  height: max-content;
`;

const Swipable: React.FC<{}> = () => {
  return (
    <Wrapper data-idtf={'swipable'}>
      <Timeline />
      <Grid />
    </Wrapper>
  );
};

export default Swipable;
