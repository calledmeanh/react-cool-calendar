import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Flex, Line } from './common';
import { TimeUtil } from '../util';
import { CONFIG } from '../constant';
import { clsx } from '../util';

const Wrapper = styled(Flex)`
  width: 48px;
  height: max-content;
  padding-top: 60px;
  border-right: 1px solid #d5d7da;
`;

const Time: React.FC<{}> = () => {
  const renderTime = useCallback(() => {
    return TimeUtil.createTimes(
      CONFIG.DEFAULT.DAY_TIME.end,
      CONFIG.DEFAULT.DAY_TIME.start,
      CONFIG.DEFAULT.DURATION
    ).map((t, i) => {
      const currentTime: number = CONFIG.DEFAULT.DAY_TIME.start + i * CONFIG.DEFAULT.DURATION;
      const time: string = TimeUtil.convertSecondsToHourString(currentTime);
      const showTime: boolean = TimeUtil.displayTime(
        currentTime,
        CONFIG.DEFAULT.DAY_TIME.start,
        CONFIG.DEFAULT.DURATION * CONFIG.DEFAULT.MAPPING_TIME[900]
      );
      const classname = clsx({
        ngt: true,
      });
      return (
        <Line data-idtf={'line'} $justify={'center'} $align={'center'} className={classname} key={i}>
          {showTime && time}
        </Line>
      );
    });
  }, []);
  return (
    <Wrapper data-idtf={'time'} $dir={'column'}>
      {renderTime()}
    </Wrapper>
  );
};

export default Time;
