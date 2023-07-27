import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Dateline from './Dateline';
import Grid from './Grid';
import { useCalendarState } from '../hook';

const Wrapper = styled.div`
  flex: 1;
  height: max-content;
`;

const Swipable: React.FC<{}> = () => {
  const [pseuHeight, setPseuHeight] = useState(0);
  const swipableRef = useRef<HTMLDivElement | null>(null);
  const calendarState = useCalendarState();

  useEffect(() => {
    if (swipableRef && swipableRef.current) {
      setPseuHeight(swipableRef.current.clientHeight);
    }
  }, [calendarState.duration]);

  return (
    <Wrapper data-idtf={'swipable'} ref={swipableRef}>
      <Dateline afterPseudoHeight={pseuHeight} />
      <Grid />
    </Wrapper>
  );
};

export default Swipable;
