import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TimeUtil } from '../util';
import { clsx } from '../util';
import { Line } from './common';
import { CONFIG } from '../constant';

const Wrapper = styled.div`
  touch-action: pan-y;
  position: relative;
  width: 100%;
  height: 100%;
  background-size: 8px 8px;
  background-image: linear-gradient(
    45deg,
    transparent 46%,
    rgba(16, 25, 40, 0.2) 49%,
    rgba(16, 25, 40, 0.2) 51%,
    transparent 55%
  );
  background-color: #eef0f2;
`;

const Grid: React.FC<{}> = () => {
  const renderRow = useCallback(() => {
    return TimeUtil.createTimes(
      CONFIG.DEFAULT.DAY_TIME.end,
      CONFIG.DEFAULT.DAY_TIME.start,
      CONFIG.DEFAULT.DURATION
    ).map((t, i) => {
      const currentTime: number = CONFIG.DEFAULT.DAY_TIME.start + i * CONFIG.DEFAULT.DURATION;
      const workingTime: boolean = TimeUtil.checkWorkingTime(
        CONFIG.DEFAULT.DAY_TIME,
        CONFIG.DEFAULT.WORKING_TIME,
        currentTime
      );
      const groupTime: boolean = TimeUtil.checkGroupTime(CONFIG.DEFAULT.GROUP_TIME, CONFIG.DEFAULT.DURATION, i, 'top');
      const classname = clsx({
        wt: workingTime,
        gt: groupTime,
      });
      return <Line data-idtf={'line'} $justify={'flex-start'} $align={'center'} className={classname} key={i}></Line>;
    });
  }, []);

  return <Wrapper data-idtf={'grid'}>{renderRow()}</Wrapper>;
};

export default Grid;
