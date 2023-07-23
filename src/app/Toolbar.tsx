import React from 'react';
import styled from 'styled-components';
import { Flex, Select, Text, Option, Button } from './common';
import { useCalendar, useCalendarDispatch } from '../hook';
import { EAction } from '../model';

const Wrapper = styled(Flex)`
  width: 100%;
  height: 68px;
  padding: 16px 24px;
`;

const Toolbar: React.FC<{}> = () => {
  const calendarState = useCalendar();
  const dispath = useCalendarDispatch();

  return (
    <Wrapper data-idtf={'toolbar'} $align={'center'} $justify={'space-between'}>
      <Text data-idtf={'label'} $padding={[8, 12]} $align={'center'} $justify={'center'}>
        Calendar
      </Text>
      <Flex data-idtf={'daytime'} $align={'center'} $justify={'center'}>
        <Button $padding={[8, 12]}>&#x2039;</Button>
        <Button disabled={true} style={{ borderRight: 'none', borderLeft: 'none' }} $padding={[8, 12]}>
          Today
        </Button>
        <Text $padding={[7, 12]} $align={'center'} $justify={'center'}>
          {new Date().getDate()}
        </Text>
        <Button $padding={[8, 12]} style={{ borderLeft: 'none' }}>
          &#x203A;
        </Button>
      </Flex>
      <Select
        data-idtf={'mode'}
        $padding={[8, 12]}
        $isborderradius
        value={calendarState.mode}
        onChange={(e) => {
          const value = e.target.value;
          dispath({ type: EAction.MODE, payload: value });
        }}
      >
        <Option value="DAY">day</Option>
        <Option value="WEEK">week</Option>
        {/* <Option value="MONTH">month</Option> */}
      </Select>
    </Wrapper>
  );
};

export default Toolbar;
