import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Timeline from './Timeline';
import Grid from './Grid';

const Wrapper = styled.div`
  flex: 1;
  height: max-content;
`;

const Swipable: React.FC<{}> = () => {
  //TODO: check this code, find best solution 
  const gridRef = useRef<any>();
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (gridRef.current) {
      const newHeight = gridRef.current.clientHeight;
      setHeight(newHeight);
    }
  }, []);
  return (
    <Wrapper data-idtf={'swipable'} ref={gridRef}>
      <Timeline height={height} />
      <Grid />
    </Wrapper>
  );
};

export default Swipable;
