import React from 'react';
import styled from 'styled-components';
import Dateline from './Dateline';
import Grid from './Grid';

const Wrapper = styled.div`
  flex: 1;
  height: max-content;
`;

const Swipable: React.FC = () => {
  return (
    <Wrapper data-idtf={'swipable'}>
      <Dateline />
      <Grid />
    </Wrapper>
  );
};

export default Swipable;
