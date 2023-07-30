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
  const calendarState = useCalendarState();
  const swipableRef = useRef<HTMLDivElement | null>(null);

  const [pseuHeight, setPseuHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (swipableRef && swipableRef.current) {
      setPseuHeight(swipableRef.current.clientHeight);
      setWidth(swipableRef.current.clientWidth);
    }
  }, [calendarState.duration]);

  return (
    <Wrapper data-idtf={'swipable'} ref={swipableRef}>
      <Dateline afterPseudoHeight={pseuHeight} />
      <Grid parentWidth={width} />
    </Wrapper>
  );
};

export default Swipable;
