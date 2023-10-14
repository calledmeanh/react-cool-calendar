import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Dateline from './Dateline';
import Grid from './Grid';
import { useCalendarState } from '../hook';
import { DateUtils } from '../util';

const Wrapper = styled.div`
  flex: 1;
  height: max-content;
`;

const Swipable: React.FC<{}> = () => {
  const calendarState = useCalendarState();
  const swipableRef = useRef<HTMLDivElement | null>(null);
  const [pseuHeight, setPseuHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const dateline = DateUtils.getDateline(calendarState.currentDate, calendarState.viewMode);
  const widthTimeline = width / dateline.length;

  useEffect(() => {
    if (swipableRef && swipableRef.current) {
      setPseuHeight(Math.floor(swipableRef.current.offsetHeight));
      setWidth(Math.floor(swipableRef.current.offsetWidth));
    }
  }, [calendarState.duration]);

  return (
    <Wrapper data-idtf={'swipable'} ref={swipableRef}>
      <Dateline afterPseudoHeight={pseuHeight} />
      <Grid widthTimeline={widthTimeline} />
    </Wrapper>
  );
};

export default Swipable;
