import React from 'react';
import styled from 'styled-components';
import { Flex, Select, Text, Option, Button } from './common';

const Wrapper = styled(Flex)`
  width: 100%;
  height: 68px;
  padding: 16px 24px;
`;

const Toolbar: React.FC<{}> = () => {
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
      <Select data-idtf={'mode'} $padding={[8, 12]} $isborderradius>
        <Option value="day">day</Option>
        <Option value="week">week</Option>
        <Option value="month">month</Option>
      </Select>
    </Wrapper>
  );
};

export default Toolbar;
